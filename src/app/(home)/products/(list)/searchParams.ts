import {
	createSearchParamsCache,
	createSerializer,
	parseAsFloat,
	parseAsString,
	parseAsStringEnum
} from "nuqs/server"

export enum ProductSort {
	relevance = "relevance",
	latest = "latest",
	// topSales = "topSales",
	priceLowToHigh = "priceLowToHigh",
	priceHighToLow = "priceHighToLow"
}

export const searchParams = {
	search: parseAsString.withDefault(""),
	category: parseAsString.withDefault(""),
	rating: parseAsFloat.withDefault(0),
	minPrice: parseAsFloat.withDefault(0),
	maxPrice: parseAsFloat.withDefault(0),
	sortBy: parseAsStringEnum<ProductSort>(
		Object.values(ProductSort)
	).withDefault(ProductSort.relevance)
}

export const searchParamsCache = createSearchParamsCache(searchParams)
export const serialize = createSerializer(searchParams)
