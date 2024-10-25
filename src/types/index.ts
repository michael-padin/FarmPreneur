import { z } from "zod"

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1)
})
export type LoginType = z.infer<typeof LoginSchema>

export interface SearchParams {
	[key: string]: string | string[] | undefined
}

export interface Option {
	label: string
	value: string
	icon?: React.ComponentType<{ className?: string }>
	withCount?: boolean
}

export interface DataTableFilterField<TData> {
	label: string
	value: keyof TData
	placeholder?: string
	options?: Option[]
}

export interface DataTableFilterOption<TData> {
	id: string
	label: string
	value: keyof TData
	options: Option[]
	filterValues?: string[]
	filterOperator?: string
	isMulti?: boolean
}

//MARK:MAPBOX
export type RoutablePoint = {
	name: string
	latitude: number
	longitude: number
}

export type Coordinates = {
	longitude: number
	latitude: number
	accuracy?: string
	routable_points?: RoutablePoint[]
}

export type BoundingBox = [number, number, number, number]

export type Context = {
	address?: {
		mapbox_id: string
		address_number: string
		street_name: string
		name: string
	}
	street?: {
		mapbox_id: string
		name: string
	}
	postcode?: {
		mapbox_id: string
		name: string
	}
	locality?: {
		mapbox_id: string
		name: string
	}
	place?: {
		mapbox_id: string
		name: string
		wikidata_id?: string
	}
	region?: {
		mapbox_id: string
		name: string
		wikidata_id?: string
	}
	country?: {
		mapbox_id: string
		name: string
		wikidata_id: string
		country_code?: string
		country_code_alpha_3?: string
	}
}

export type FeatureProperties = {
	mapbox_id: string
	feature_type: string
	full_address: string
	name: string
	name_preferred: string
	coordinates: Coordinates
	place_formatted: string
	bbox?: BoundingBox
	context: Context
	additional_feature_types?: string[]
}

export type Feature = {
	type: "Feature"
	id: string
	geometry: {
		type: "Point"
		coordinates: [number, number]
	}
	properties: FeatureProperties
}

export type FeatureCollection = {
	type: "FeatureCollection"
	features: Feature[]
	attribution: string
}
