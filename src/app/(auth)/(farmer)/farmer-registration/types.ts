import { addressSchema } from "@/validations/address"
import { mediaFileSchema } from "@/validations/media"
import { DocumentType } from "@prisma/client"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const farmRegistrationSchema = z.object({
	user: z.object({
		name: z.string(),
		email: z.string().email()
	}),
	contactNumber: z
		.string()
		.refine(isValidPhoneNumber, "Invalid Contact Number"),
	address: addressSchema.refine((data) => data.fullAddress, {
		message: "Required"
	}),
	farmDescription: z.string().min(2),
	farmName: z.string().min(2),
	birthDate: z.date(),
	farmImages: z.array(mediaFileSchema).min(1, "Required"),
	documentVerification: z.object({
		type: z.nativeEnum(DocumentType),
		image: mediaFileSchema.refine((data) => data.url, {
			message: "Required"
		})
	})
})

export type FarmRegistrationSchema = z.infer<typeof farmRegistrationSchema>
