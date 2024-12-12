import { Gender } from "@prisma/client"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const editCustomerProfileSchema = z.object({
	fullName: z.string().min(2, "Required"),
	contactNumber: z.string().refine(isValidPhoneNumber),
	birthDate: z.date(),
	email: z.string().email({
		message: "Please enter a valid email address."
	}),
	gender: z.nativeEnum(Gender).nullable()
})

export type EditCustomerProfileSchema = z.infer<
	typeof editCustomerProfileSchema
>
