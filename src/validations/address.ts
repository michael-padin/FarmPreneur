import { z } from "zod"

export const addressSchema = z.object({
	fullAddress: z.string(),
	street: z.string().nullish(),
	region: z.string().nullish(),
	country: z.string().nullish(),
	postalCode: z.string().nullish(),
	latitude: z.number(),
	longitude: z.number()
})

export type AddressSchema = z.infer<typeof addressSchema>
