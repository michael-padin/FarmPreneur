import { addressSchema } from "@/validations/address"
import { documentVerificationSchema } from "@/validations/verification-document"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const registerFarmerSchema = z
	.object({
		email: z.string().min(1, "Required").email(),
		firstName: z.string().min(1, "Required"),
		lastName: z.string().min(1, "Required"),
		birthDate: z.string().date(),
		address: addressSchema.refine((data) => data.fullAddress, {
			message: "Required"
		}),
		contactNumber: z
			.string()
			.min(5, "Required")
			.refine(isValidPhoneNumber, { message: "Invalid phone number" }),
		documentVerification: documentVerificationSchema,
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string().min(1, "Required")
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"]
	})

export type RegisterFarmerSchema = z.infer<typeof registerFarmerSchema>
