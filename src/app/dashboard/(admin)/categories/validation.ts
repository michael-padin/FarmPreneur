import { imageSchema } from "@/validations/image"
import { z } from "zod"

export const createCategorySchema = z.object({
	name: z.string().min(1, "Required."),
	description: z.string().min(1, "Required.").optional(),
	image: imageSchema.refine((data) => data.url, {
		message: "Required"
	})
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>
