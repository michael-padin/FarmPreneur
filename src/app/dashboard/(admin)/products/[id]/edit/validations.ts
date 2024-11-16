import { addressSchema } from "@/validations/address"
import { imageSchema } from "@/validations/image"
import { ProductListingStatus } from "@prisma/client"
import { z } from "zod"

export const updateProductSchema = z.object({
	farmerId: z.string().min(1, "Required"),
	categoryId: z.string().min(1, "Required"),
	title: z.string().min(4, "Required"),
	description: z.string().min(4, "Required"),
	price: z.coerce.number().min(1, "Required"),
	unit: z.string().min(1, "Required"),
	quantity: z.coerce.number().min(1, "Required"),
	images: imageSchema.array().min(1, "Required"),
	pickupLocation: addressSchema.optional(),
	listingStatus: z.nativeEnum(ProductListingStatus)
})

export type UpdateProductSchema = z.infer<typeof updateProductSchema>
