import { addressSchema } from "@/validations/address"
import { verificationDocumentSchema } from "@/validations/verification-document"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const registerFarmerSchema = z
	.object({
		email: z.string().min(1, "Required").email(),
		firstName: z.string().min(2, "Required"),
		lastName: z.string().min(2, "Required"),
		birthDate: z
			.string()
			.min(1, "Required")
			.refine(
				(value) => {
					const date = new Date(value)
					return !isNaN(date.getTime()) // Check if the date is valid
				},
				{
					message: "Invalid date"
				}
			),
		address: addressSchema.refine((data) => data.fullAddress !== "", {
			message: "Required"
		}),
		contactNumber: z
			.string()
			.refine(isValidPhoneNumber, { message: "Invalid phone number" }),
		documentVerification: verificationDocumentSchema,
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string().min(1, "Required")
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"]
	})

export type RegisterFarmerSchema = z.infer<typeof registerFarmerSchema>
