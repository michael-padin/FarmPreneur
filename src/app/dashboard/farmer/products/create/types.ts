import { addressSchema } from "@/validations/address"
import { imageSchema } from "@/validations/image"
import { z } from "zod"

export const createProductSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters."
	}),
	description: z.string().min(10, {
		message: "Description must be at least 10 characters."
	}),
	price: z.coerce.number().min(1, {
		message: "Price must be at least 1 character."
	}),

	category: z.string().min(1, {
		message: "Category must be at least 1 character."
	}),
	images: z.array(imageSchema).min(1, "Required"),
	location: addressSchema,
	quantity: z.coerce.number().min(1, {
		message: "Quantity must be at least 1 character."
	})
})
export type createProductType = z.infer<typeof createProductSchema>
