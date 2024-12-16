import { endOfMonth, startOfMonth, subMonths } from "date-fns"

import { CartItem, GroupedCartItem } from "@/types/cart"
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
	return new Intl.NumberFormat("en-PH", {}).format(amount)
}

export const isDevelopment = process.env.NODE_ENV === "development"

export const getFirstWord = (str: string) => {
	// Split the string by spaces
	const words = str.trim().split(/\s+/)

	// Return the first word
	return words[0] || "" // Return an empty string if there are no words
}

export const abbreviateNumber = (num: number) => {
	if (num >= 1e9) {
		return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "b" // Billion
	} else if (num >= 1e6) {
		return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "m" // Million
	} else if (num >= 1e3) {
		return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k" // Thousand
	} else {
		return num.toString() // Less than 1000
	}
}

export function groupCartItemsByFarmer(
	cartItems: CartItem[]
): GroupedCartItem[] {
	const grouped = cartItems.reduce(
		(acc, cartItem) => {
			const farmerId = cartItem.product.farmer.id

			if (!acc[farmerId]) {
				acc[farmerId] = {
					farmer: cartItem.product.farmer,
					items: []
				}
			}

			acc[farmerId].items.push(cartItem)

			return acc
		},
		{} as Record<string, GroupedCartItem>
	)

	return Object.values(grouped)
}

/**
 * Get start and end dates for the current month and previous month
 * relative to a given date.
 *
 * @param date - The reference date to calculate the month ranges.
 */
export const getMonthRangeByDate = (date: Date) => {
	const startOfCurrentMonth = startOfMonth(date)
	const endOfCurrentMonth = endOfMonth(date)
	const startOfPreviousMonth = startOfMonth(subMonths(date, 1))
	const endOfPreviousMonth = endOfMonth(startOfPreviousMonth)

	return {
		currentMonth: { start: startOfCurrentMonth, end: endOfCurrentMonth },
		previousMonth: { start: startOfPreviousMonth, end: endOfPreviousMonth }
	}
}

// Function to calculate the percentage change between current and previous month revenue
export const calculateRevenueGrowthPercentage = (
	currentMonthRevenue: number,
	previousMonthRevenue: number
) => {
	if (previousMonthRevenue === 0) {
		return currentMonthRevenue > 0 ? 100 : 0 // 100% growth if current revenue > 0, otherwise 0% if no revenue
	}
	return (
		((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
	)
}
