import { FarmerApplicationStatus } from "@prisma/client"
import { z } from "zod"

const addressSchema = z.object({
	fullAddress: z.string(),
	street: z.string().nullish(),
	region: z.string().nullish(),
	country: z.string().nullish(),
	postalCode: z.string().nullish(),
	latitude: z.number().nullish(),
	longitude: z.number().nullish()
})

export type Address = z.infer<typeof addressSchema>

export const updateUserFormSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email({ message: "Invalid email address." }),
	contactNumber: z
		.string()
		.min(10, { message: "Contact number must be at least 10 digits." }),
	role: z.string(),
	farmerDetails: z
		.object({
			applicationStatus: z.nativeEnum(FarmerApplicationStatus),
			farmName: z.string(),
			farmDescription: z.string(),
			address: addressSchema.nullish(),
			products: z.array(z.string()),
			images: z.array(z.string())
		})
		.nullish(),
	address: addressSchema.nullish()
})

export type UpdateUser = z.infer<typeof updateUserFormSchema>
