import { ProductListingStatus } from "@prisma/client"
import {
	createSearchParamsCache,
	createSerializer,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
	parseAsStringLiteral
} from "nuqs/server"

export const searchParams = {
	status: parseAsStringEnum<ProductListingStatus>(
		Object.values(ProductListingStatus)
	)
}

export const searchParamsCache = createSearchParamsCache(searchParams)
export const serialize = createSerializer(searchParams)
