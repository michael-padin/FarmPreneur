import { z } from "zod"

export const ImageSchema = z.object({
	url: z.string(),
	filename: z.string(),
	size: z.number(),
	mimeType: z.string()
})

export type Image = z.infer<typeof ImageSchema>
