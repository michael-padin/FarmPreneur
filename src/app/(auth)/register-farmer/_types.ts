import { z } from "zod"
import { isValidPhoneNumber } from "react-phone-number-input"

export const RegisterFarmerSchema = z.object({
	userId: z.string(),
	email: z.string().email(),
	name: z.string().min(2),
	description: z.string().min(8, "About must be at least 8 characters long"),
	contactNumber: z.string(),
	location: z.string().min(2),
	products: z.string(),
	images: z.array(z.string()).optional()
})

export type RegisterFarmerType = z.infer<typeof RegisterFarmerSchema>
