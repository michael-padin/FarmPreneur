import { addressSchema } from "@/validations/address"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const newCustomerAddressSchema = z.object({
	contactName: z.string().min(1, "Required"),
	note: z.string().optional(),
	contactNumber: z.string().refine(isValidPhoneNumber, "Invalid number"),
	label: z.string().optional(),
	address: addressSchema.refine((data) => data.fullAddress, {
		message: "Required"
	}),
	isDefault: z.boolean().default(false)
})

export type NewAddressCustomerSchema = z.infer<typeof newCustomerAddressSchema>
