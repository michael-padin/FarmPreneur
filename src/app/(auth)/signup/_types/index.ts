import { addressSchema } from "@/validations/address"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const RegisterSchema = z
	.object({
		email: z.string().email().min(1),
		firstName: z.string().min(2),
		lastName: z.string().min(2),
		birthDate: z.date().min(new Date("1900-01-01")),
		address: addressSchema,
		contactNumber: z
			.string()
			.refine(isValidPhoneNumber, { message: "Invalid phone number" }),
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"]
	})

export type RegisterType = z.infer<typeof RegisterSchema>
