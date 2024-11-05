import { Address } from "@/app/dashboard/(admin)/users/(lists)/types"
import {
	createFarmDetailsAddress,
	createUserAddress
} from "@/data-access/address"
import { AddressSchema } from "@/validations/address"

export const upsertAddressUseCase = async (
	data: Address & { userId: string; id: string }
) => {
	// return await upsertAddress(data)
}

export const createFarmDetailsAddressUseCase = async (
	data: AddressSchema & { farmDetailsId: string }
) => {
	try {
		await createFarmDetailsAddress(data)
	} catch (error) {
		console.error("error in createFarmDetailsAddressUseCase", error)
	}
}

export const createUserAddressUseCase = async (
	data: AddressSchema & { userId: string }
) => {
	try {
		await createUserAddress(data)
	} catch (error) {
		console.error("error in createUserAddressUseCase", error)
	}
}
