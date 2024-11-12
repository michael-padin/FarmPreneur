import { addressSchema } from "@/validations/address"
import { imageSchema } from "@/validations/image"
import { DocumentType } from "@prisma/client"
import { z } from "zod"

export const farmRegistrationSchema = z.object({
	user: z.object({
		name: z.string(),
		email: z.string().email()
	}),
	contactNumber: z.string().min(1, "Required"),
	address: addressSchema.refine((data) => data.fullAddress, {
		message: "Required",
		path: ["address"]
	}),
	birthDate: z.date(),
	farmName: z.string().optional(),
	farmDescription: z.string(),
	farmImages: z.array(imageSchema).min(1, "Required"),
	documentVerification: z.object({
		type: z.nativeEnum(DocumentType),
		image: imageSchema.refine((data) => data.url, {
			message: "Required"
		})
	})
})

export type FarmRegistrationSchema = z.infer<typeof farmRegistrationSchema>
