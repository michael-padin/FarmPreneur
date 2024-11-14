import { z } from "zod"

export const imageSchema = z.object({
	url: z.string().min(1, "Required"),
	filename: z.string(),
	size: z.number(),
	mimeType: z.string()
})

export type ImageSchema = z.infer<typeof imageSchema>
