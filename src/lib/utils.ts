import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(
	date: Date | string | number,
	opts: Intl.DateTimeFormatOptions = {}
) {
	return new Intl.DateTimeFormat("en-US", {
		month: opts.month ?? "long",
		day: opts.day ?? "numeric",
		year: opts.year ?? "numeric",
		...opts
	}).format(new Date(date))
}

export const isOtpExpired = (expiresAt: Date) => {
	return new Date() > new Date(expiresAt)
}

export const formatPHP = (amount: number) => {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP"
	}).format(amount)
}

export const isDevelopment = process.env.NODE_ENV === "development"

export const getFirstWord = (str: string) => {
	// Split the string by spaces
	const words = str.trim().split(/\s+/)

	// Return the first word
	return words[0] || "" // Return an empty string if there are no words
}
