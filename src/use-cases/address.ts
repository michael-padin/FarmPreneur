import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import {
	createFarmDetailsAddress,
	createFarmerAddress,
	createUserAddress,
	getFarmerAddresses
} from "@/data-access/address"
import { getFarmerByUserId } from "@/data-access/farmers"
import { AddressSchema } from "@/validations/address"

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

export const createFarmerAddressUseCase = async (
	data: FarmRegistrationSchema & { farmerId: string }
) => {
	return await createFarmerAddress(data)
}

export const getFarmerAddressesUseCase = async (userId: string) => {
	try {
		const farmer = await getFarmerByUserId(userId)
		console.log("farmer :>> ", farmer)

		if (!farmer) {
			throw new Error("No farmer found!")
		}

		return await getFarmerAddresses(farmer.id)
	} catch (error) {
		console.error("error in getFarmerAddresses", error)
	}
}
