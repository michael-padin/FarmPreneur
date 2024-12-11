import { OrderStatus } from "@prisma/client"
import {
	createSearchParamsCache,
	createSerializer,
	parseAsString,
	parseAsStringEnum
} from "nuqs/server"

export const searchParams = {
	status: parseAsStringEnum<OrderStatus>(Object.values(OrderStatus)),
	search: parseAsString.withDefault("")
}

export const searchParamsCache = createSearchParamsCache(searchParams)
export const serialize = createSerializer(searchParams)
