import { addressSchema } from "@/validations/address"
import { mediaFileSchema } from "@/validations/media"
import { verificationDocumentSchema } from "@/validations/verification-document"
import { FarmerApplicationStatus, ROLE } from "@prisma/client"
// import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const editCustomerSchema = z.object({
	contactNumber: z.string().min(10).nullish(),
	address: addressSchema.nullish()
})

export const editFarmerSchema = z.object({
	birthDate: z.date(),
	contactNumber: z.string(),

	farmName: z.string().min(2),
	farmDescription: z.string().min(2),
	applicationStatus: z.nativeEnum(FarmerApplicationStatus),
	address: addressSchema,
	verificationDocument: verificationDocumentSchema,
	farmImages: mediaFileSchema.array().min(1, "Required")
})

export const editUserSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	role: z.nativeEnum(ROLE),
	password: z.string().nullable(),
	isEmailVerified: z.boolean(),
	customer: editCustomerSchema.nullish(),
	farmer: editFarmerSchema.nullable()
})

export type EditUserSchema = z.infer<typeof editUserSchema>

export type EditCustomerSchema = z.infer<typeof editCustomerSchema>

export type EditFarmerSchema = z.infer<typeof editFarmerSchema>
