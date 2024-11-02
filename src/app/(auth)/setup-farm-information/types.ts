import { addressSchema } from "@/validations/address"
import { imageSchema } from "@/validations/image"
import { z } from "zod"

export const setupFarmInformationSchema = z.object({
	farmDescription: z.string().min(1),
	farmName: z.string().min(1),
	products: z.array(z.string().min(1)),
	images: z.array(imageSchema).min(1, { message: "Upload at least 1 image" }),
	address: addressSchema
})

export type SetupFarmInformationSchema = z.infer<
	typeof setupFarmInformationSchema
>
