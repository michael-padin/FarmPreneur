import { DocumentType } from "@prisma/client"
import { z } from "zod"
import { imageSchema } from "./image"

export const verificationDocumentSchema = z.object({
	type: z.nativeEnum(DocumentType).nullable(),
	image: imageSchema.nullable().refine((data) => data !== null, {
		message: "Required"
	})
})
