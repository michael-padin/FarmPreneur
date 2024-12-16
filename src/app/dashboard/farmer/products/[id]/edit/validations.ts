import { mediaFileSchema } from "@/validations/media"
import { z } from "zod"

export const editProductSchema = z.object({
	categoryId: z.string().min(1, "Required"),
	title: z.string().min(4, "Required"),
	description: z.string().min(4, "Required"),
	price: z.coerce.number().min(1, "Required"),
	unit: z.string().min(1, "Required"),
	quantity: z.coerce.number().min(1, "Required"),
	images: z.array(mediaFileSchema).min(1, "Upload at least 1 image")
})

export type EditProductSchema = z.infer<typeof editProductSchema>
