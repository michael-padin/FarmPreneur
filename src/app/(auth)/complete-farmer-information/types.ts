import { ImageSchema } from "@/validations/image"
import { DocumentType } from "@prisma/client"
import { z } from "zod"

export const CompleteFarmerInformationSchema = z.object({
	farmDescription: z.string().min(1),
	images: z.array(ImageSchema).min(1),
	farmName: z.string().min(1),
	products: z.array(z.string().min(1)),
	address: z.object({
		fullAddress: z.string().min(1),
		street: z.string().min(1),
		region: z.string().min(1),
		country: z.string().min(1),
		postalCode: z.string().min(1),
		latitude: z.number(),
		longitude: z.number()
	})
})

export type CompleteFarmerInformationType = z.infer<
	typeof CompleteFarmerInformationSchema
>
