import { imageSchema } from "@/validations/image"
import { z } from "zod"

export const editProductSchema = z.object({
	categoryId: z.string().min(1, "Required"),
	title: z.string().min(4, "Required"),
	description: z.string().min(4, "Required"),
	price: z.coerce.number().min(1, "Required"),
	unit: z.string().min(1, "Required"),
	quantity: z.coerce.number().min(1, "Required"),
	images: imageSchema.array().min(1, "Required")
})

export type EditProductSchema = z.infer<typeof editProductSchema>
