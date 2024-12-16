import { mediaFileSchema } from "@/validations/media"
import { Gender } from "@prisma/client"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const editFarmerProfileSchema = z.object({
	farmerName: z.string().min(2, "Required"),
	farmDescription: z.string().optional(),
	contactNumber: z.string().refine(isValidPhoneNumber),
	birthDate: z.date(),
	email: z.string().email({
		message: "Please enter a valid email address."
	}),
	coverPhoto: mediaFileSchema.nullable(),
	profilePicture: mediaFileSchema.nullable(),
	gender: z.nativeEnum(Gender).optional()
})

export type EditFarmerProfileSchema = z.infer<typeof editFarmerProfileSchema>

/**
 * name: string
		email: string
		birthDate: string | Date
		contactNumber: string
		fullName: string
		gender: string
		coverPhoto: string
		profilePicture: string
 */
