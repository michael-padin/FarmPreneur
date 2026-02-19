type RateLimitInput = {
	namespace: string
	identifier: string
	limit: number
	windowMs: number
}

export type RateLimitResult = {
	allowed: boolean
	limit: number
	remaining: number
	resetAt: number
	retryAfterSeconds: number
}

type LocalBucket = {
	count: number
	resetAt: number
}

const RATE_LIMIT_PREFIX = "farmpreneur:ratelimit"
const FALLBACK_IDENTIFIER = "anonymous"

declare global {
	// eslint-disable-next-line no-var
	var __farmpreneurRateLimitBuckets: Map<string, LocalBucket> | undefined
	// eslint-disable-next-line no-var
	var __farmpreneurRateLimitGcCounter: number | undefined
}

const localBuckets =
	globalThis.__farmpreneurRateLimitBuckets ?? new Map<string, LocalBucket>()

if (!globalThis.__farmpreneurRateLimitBuckets) {
	globalThis.__farmpreneurRateLimitBuckets = localBuckets
}

const sanitizeIdentifier = (value: string) => {
	const trimmed = value.trim().slice(0, 160)
	const sanitized = trimmed.replace(/[^a-zA-Z0-9:._-]/g, "_")
	return sanitized || FALLBACK_IDENTIFIER
}

const cleanupLocalBuckets = (now: number) => {
	const gcCounter = (globalThis.__farmpreneurRateLimitGcCounter ?? 0) + 1
	globalThis.__farmpreneurRateLimitGcCounter = gcCounter

	if (gcCounter % 200 !== 0 && localBuckets.size < 5000) return

	for (const [key, bucket] of localBuckets.entries()) {
		if (bucket.resetAt <= now) {
			localBuckets.delete(key)
		}
	}
}

const getBucketDetails = (
	namespace: string,
	identifier: string,
	windowMs: number
) => {
	const now = Date.now()
	const windowId = Math.floor(now / windowMs)
	const resetAt = (windowId + 1) * windowMs
	const bucketKey = `${RATE_LIMIT_PREFIX}:${namespace}:${identifier}:${windowId}`

	return { now, resetAt, bucketKey }
}

const incrementLocalBucket = (bucketKey: string, resetAt: number) => {
	const current = localBuckets.get(bucketKey)

	if (!current) {
		localBuckets.set(bucketKey, { count: 1, resetAt })
		return 1
	}

	current.count += 1
	localBuckets.set(bucketKey, current)
	return current.count
}

const hasUpstashConfig = () =>
	Boolean(
		process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
	)

const incrementUpstashBucket = async (bucketKey: string, windowMs: number) => {
	const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "")
	const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

	if (!upstashUrl || !upstashToken) {
		throw new Error("Missing Upstash configuration")
	}

	const requestHeaders = {
		Authorization: `Bearer ${upstashToken}`
	}
	const encodedKey = encodeURIComponent(bucketKey)
	const incrementResponse = await fetch(`${upstashUrl}/incr/${encodedKey}`, {
		method: "POST",
		headers: requestHeaders,
		cache: "no-store"
	})

	if (!incrementResponse.ok) {
		throw new Error(`Upstash increment failed with ${incrementResponse.status}`)
	}

	const incrementPayload = (await incrementResponse.json()) as {
		result?: number | string
	}
	const count = Number(incrementPayload.result)

	if (!Number.isFinite(count)) {
		throw new Error("Invalid Upstash increment response")
	}

	if (count === 1) {
		const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000))
		const expireResponse = await fetch(
			`${upstashUrl}/expire/${encodedKey}/${windowSeconds}`,
			{
				method: "POST",
				headers: requestHeaders,
				cache: "no-store"
			}
		)

		if (!expireResponse.ok) {
			throw new Error(`Upstash expire failed with ${expireResponse.status}`)
		}
	}

	return count
}

export const getClientIdentifier = (headers: Headers) => {
	const xForwardedFor = headers.get("x-forwarded-for")
	if (xForwardedFor) {
		const [first] = xForwardedFor.split(",")
		return sanitizeIdentifier(first || FALLBACK_IDENTIFIER)
	}

	const forwardedFor =
		headers.get("x-vercel-forwarded-for") ??
		headers.get("x-real-ip") ??
		headers.get("cf-connecting-ip")

	if (forwardedFor) {
		return sanitizeIdentifier(forwardedFor)
	}

	const forwardedHeader = headers.get("forwarded")
	if (forwardedHeader) {
		const match = forwardedHeader.match(/for=([^;,\s]+)/i)
		if (match?.[1]) {
			return sanitizeIdentifier(match[1].replace(/"/g, ""))
		}
	}

	const userAgent = headers.get("user-agent")
	if (userAgent) {
		return sanitizeIdentifier(`ua:${userAgent.slice(0, 80)}`)
	}

	return FALLBACK_IDENTIFIER
}

export const setRateLimitHeaders = (
	response: Response,
	result: RateLimitResult
) => {
	response.headers.set("X-RateLimit-Limit", String(result.limit))
	response.headers.set("X-RateLimit-Remaining", String(result.remaining))
	response.headers.set(
		"X-RateLimit-Reset",
		String(Math.floor(result.resetAt / 1000))
	)
	response.headers.set("Retry-After", String(result.retryAfterSeconds))
	response.headers.set("Cache-Control", "no-store")
}

export const checkRateLimit = async (
	input: RateLimitInput
): Promise<RateLimitResult> => {
	const limit = Math.max(1, input.limit)
	const windowMs = Math.max(1000, input.windowMs)
	const namespace = sanitizeIdentifier(input.namespace)
	const identifier = sanitizeIdentifier(input.identifier)
	const { now, resetAt, bucketKey } = getBucketDetails(
		namespace,
		identifier,
		windowMs
	)

	cleanupLocalBuckets(now)

	let count: number

	try {
		count = hasUpstashConfig()
			? await incrementUpstashBucket(bucketKey, windowMs)
			: incrementLocalBucket(bucketKey, resetAt)
	} catch {
		count = incrementLocalBucket(bucketKey, resetAt)
	}

	const remaining = Math.max(0, limit - count)
	const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000))

	return {
		allowed: count <= limit,
		limit,
		remaining,
		resetAt,
		retryAfterSeconds
	}
}

export const buildRateLimitErrorMessage = (retryAfterSeconds: number) =>
	`Too many requests. Please try again in ${retryAfterSeconds} seconds.`
