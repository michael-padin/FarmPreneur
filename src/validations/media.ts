import { z } from "zod"

export const mediaFileSchema = z.object({
	id: z.string(),
	file: z.instanceof(File).nullable(),
	url: z.string(),
	type: z.enum(["image", "video"])
})

export type MediaFile = z.infer<typeof mediaFileSchema>
