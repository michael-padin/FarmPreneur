import { ImageSchema } from "@/validations/image"
import { z } from "zod"

export const createProductSchema = z.object({
	farmerId: z.string().min(1, {
		message: "Farmer ID must be at least 1 character."
	}),
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
	images: z.array(ImageSchema).min(1),
	location: z.string().min(1, {
		message: "Location must be at least 1 character."
	}),
	quantity: z.coerce.number().min(1, {
		message: "Quantity must be at least 1 character."
	})
})
export type createProductType = z.infer<typeof createProductSchema>
