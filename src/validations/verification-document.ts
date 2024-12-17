import { DocumentType } from "@prisma/client"
import { z } from "zod"
import { mediaFileSchema } from "./media"

export const verificationDocumentSchema = z.object({
	type: z.nativeEnum(DocumentType),
	image: mediaFileSchema
		.refine((data) => data.url, {
			message: "Required",
			path: ["image"]
		})
		.nullable()
})
