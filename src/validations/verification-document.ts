import { DocumentType } from "@prisma/client"
import { z } from "zod"
import { imageSchema } from "./image"

export const verificationDocumentSchema = z.object({
	type: z.nativeEnum(DocumentType),
	image: imageSchema.refine((data) => data.url, {
		message: "Required"
	})
})
