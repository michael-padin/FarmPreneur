import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { auth } from "@/auth"
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

export const getFarmerAddressesUseCase = async () => {
	const session = await auth()
	if (!session || !session.user) {
		throw new Error("Unauthorized")
	}
	const farmer = await getFarmerByUserId(session.user.id)

	if (!farmer) {
		throw new Error("No farmer found!")
	}
	return await getFarmerAddresses(farmer.id)
}
