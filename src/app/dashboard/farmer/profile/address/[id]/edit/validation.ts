import { addressSchema } from "@/validations/address"
import { isValidPhoneNumber } from "react-phone-number-input"
import { z } from "zod"

export const editFarmerAddressSchema = z.object({
	contactName: z.string().min(1, "Contact name is required"),
	contactNumber: z.string().refine(isValidPhoneNumber),
	address: addressSchema.refine((data) => data.fullAddress, {
		message: "Required",
		path: ["address"]
	}),
	note: z.string().optional()
})

export type EditFarmerAddressSchema = z.infer<typeof editFarmerAddressSchema>
