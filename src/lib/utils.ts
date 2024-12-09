import { CartItem, Farmer, GroupedCartItem } from "@/types/cart"
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

export function groupCartItemsByFarmerAndLocation(
	cartItems: CartItem[]
): GroupedCartItem[] {
	// Create a map to group cart items by farmer ID
	const farmerMap = new Map<
		string,
		{
			farmer: Farmer
			locationMap: Map<string, CartItem[]>
		}
	>()

	// Group cart items
	cartItems.forEach((cartItem) => {
		const product = cartItem.product

		// Ensure farmer entry exists
		if (!farmerMap.has(product.farmer.id)) {
			farmerMap.set(product.farmer.id, {
				farmer: product.farmer,
				locationMap: new Map<string, CartItem[]>()
			})
		}

		const farmerEntry = farmerMap.get(product.farmer.id)!

		// Ensure location entry exists for this farmer
		if (!farmerEntry.locationMap.has(product.pickupLocation.id)) {
			farmerEntry.locationMap.set(product.pickupLocation.id, [])
		}

		// Add cart item to the correct location for this farmer
		farmerEntry.locationMap.get(product.pickupLocation.id)!.push(cartItem)
	})

	// Transform the map into the final grouped structure
	return Array.from(farmerMap.values()).map((farmerGroup) => ({
		farmer: farmerGroup.farmer,
		locations: Array.from(farmerGroup.locationMap.entries()).map(
			([locationId, cartItems]) => ({
				pickupLocation: cartItems[0].product.pickupLocation,
				cartItems
			})
		)
	}))
}
