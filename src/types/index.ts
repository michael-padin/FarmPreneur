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
export interface FeatureCollection {
	id: string
	type: "Feature"
	place_type: string[]
	relevance: number
	properties: Properties
	text: string
	place_name: string
	center: number[]
	geometry: Geometry
	context: Context[]
	bbox?: number[] // bbox is optional and present in some objects
}

export interface Properties {
	accuracy?: string // accuracy is optional
	mapbox_id: string
	wikidata?: string // wikidata is optional and present in some objects
	short_code?: string // short_code is optional
}

export interface Geometry {
	type: "Point"
	coordinates: number[]
}

export interface Context {
	id: string
	mapbox_id: string
	text: string
	wikidata?: string // wikidata is optional
	short_code?: string // short_code is optional
}
