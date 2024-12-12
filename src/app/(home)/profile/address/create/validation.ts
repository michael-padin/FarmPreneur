import { addressSchema } from "@/validations/address"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const newCustomerAddressSchema = z.object({
	contactName: z.string().min(1, "Contact name is required"),
	contactNumber: z.string().refine(isValidPhoneNumber),
	locationType: z.string().min(1, "Address type is required"),
	address: addressSchema.refine((data) => data.fullAddress, {
		message: "Required",
		path: ["address"]
	}),
	isDefault: z.boolean().default(false)
})

export type NewAddressCustomerSchema = z.infer<typeof newCustomerAddressSchema>
