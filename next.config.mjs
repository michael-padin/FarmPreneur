// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true
	},
	experimental: {
		ppr: "incremental",
		serverActions: {
			bodySizeLimit: "20mb"
		}
	},
	typescript: {
		ignoreBuildErrors: true
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com"
			},
			{
				protocol: "https",
				hostname: "pub-c0b0612ac60c481aa03192161bd30b3f.r2.dev"
			}
		]
	},
	headers: async () => {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff"
					},
					{
						key: "X-Frame-Options",
						value: "DENY"
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin"
					}
				]
			},
			{
				source: "/sw.js",
				headers: [
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8"
					},
					{
						key: "Cache-Control",
						value: "no-cache, no-store, must-revalidate"
					},
					{
						key: "Content-Security-Policy",
						value: "default-src 'self'; script-src 'self'"
					}
				]
			}
		]
	}
}

export default nextConfig
