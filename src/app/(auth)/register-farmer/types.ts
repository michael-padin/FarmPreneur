import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

const addressSchema = z.object({
	fullAddress: z.string(),
	street: z.string().nullish(),
	region: z.string().nullish(),
	country: z.string().nullish(),
	postalCode: z.string().nullish(),
	latitude: z.number(),
	longitude: z.number()
})

export const RegisterFarmerSchema = z
	.object({
		email: z.string().email().min(1),
		firstName: z.string().min(2),
		lastName: z.string().min(2),
		birthDate: z
			.date()
			.min(new Date("1900-01-01"), { message: "Invalid date" }),
		address: addressSchema.refine((data) => data.fullAddress !== "", {
			message: "Address is required"
		}),
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

export type RegisterFarmerType = z.infer<typeof RegisterFarmerSchema>
