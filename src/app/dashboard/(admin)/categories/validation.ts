import { mediaFileSchema } from "@/validations/media"
import { z } from "zod"

export const createCategorySchema = z.object({
	name: z.string().min(1, "Required."),
	description: z.string().min(1, "Required.").optional(),
	image: mediaFileSchema
		.refine((data) => data.url, {
			message: "Required"
		})
		.nullable()
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>
