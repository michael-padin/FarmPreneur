import { addressSchema } from "@/validations/address"
import { imageSchema } from "@/validations/image"
import { verificationDocumentSchema } from "@/validations/verification-document"
import { FarmerApplicationStatus, ROLE } from "@prisma/client"
import { z } from "zod"

export const updateUserSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email({ message: "Invalid email address." }),
	contactNumber: z
		.string()
		.min(10, { message: "Contact number must be at least 10 digits." }),
	role: z.nativeEnum(ROLE),
	farmerApplicationStatus: z.nativeEnum(FarmerApplicationStatus).nullable(),
	birthDate: z.date().nullable(),
	farmDetails: z
		.object({
			farmName: z.string(),
			farmDescription: z.string(),
			address: addressSchema.nullish(),
			products: z.array(z.string()),
			images: z.array(imageSchema)
		})
		.nullable(),
	address: addressSchema.nullable(),
	profilePicture: imageSchema.nullable(),
	verificationDocument: verificationDocumentSchema.nullable()
})

export type UpdateUserSchema = z.infer<typeof updateUserSchema>
