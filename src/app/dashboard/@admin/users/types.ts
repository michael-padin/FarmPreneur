import { Sheet } from "@/components/ui/sheet"
import { getUsersUseCase } from "@/use-cases/users"
import { FarmerApproval, ROLE } from "@prisma/client"
import { z } from "zod"

export interface UpdateTaskSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	user: Awaited<ReturnType<typeof getUsersUseCase>>[0]
}

const addressSchema = z.object({
	fullAddress: z.string(),
	street: z.string().nullable(),
	region: z.string().nullable(),
	country: z.string().nullable(),
	postalCode: z.string().nullable(),
	latitude: z.number(),
	longitude: z.number(),
	locationType: z.string().nullish()
})

export type Address = z.infer<typeof addressSchema>

export const updateUserSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").nullish(),
	email: z.string().email("Invalid email address").nullish(),
	isVerified: z.boolean(),
	image: z.string().url("Invalid URL").nullish(),
	farmerApproval: z.nativeEnum(FarmerApproval).nullish(),
	role: z.nativeEnum(ROLE),
	address: addressSchema,
	password: z.string().nullish(),
	contactNumber: z.string()
})

export type UpdateUserTypes = z.infer<typeof updateUserSchema>
