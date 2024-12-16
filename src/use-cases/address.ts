import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { auth } from "@/auth"
import {
	createFarmDetailsAddress,
	createFarmerAddress,
	createUserAddress,
	getFarmerAddresses
} from "@/data-access/address"
import { getFarmerByUserId } from "@/data-access/farmers"
import { db } from "@/lib/db"
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

export const getAddressById = async (id: string) => {
	const address = await db.address.findUnique({
		where: {
			id: id
		},
		include: {
			customer: {
				include: {
					user: true
				}
			}
		}
	})

	if (!address) {
		throw new Error("No address found")
	}

	return {
		id: address.id,
		label: address.label || "",
		address: {
			latitude: address.latitude,
			longitude: address.longitude,
			fullAddress: address.fullAddress || "",
			region: address.region || "",
			country: address.country || "",
			postalCode: address.postalCode || "",
			street: address.street || ""
		},
		note: address.note || "",
		contactName: address?.contactName || "",
		contactNumber: address?.contactNumber || ""
	}
}

export const getCustomerAddressListUseCase = async (customerId?: string) => {
	const session = await auth()

	let newCustomerId = session?.user.customerId
	if (!newCustomerId) {
		newCustomerId = customerId
	}

	const addressList = await db.address.findMany({
		where: {
			customerId: newCustomerId
		}
	})

	const shapedAddressList =
		addressList.length > 0
			? addressList.map((address) => ({
					id: address.id,
					contactNumber: address.contactNumber || "",
					fullAddress: address.fullAddress || "",
					isDefault: address.isDefault || false,
					contactName: address.contactName || "",
					latitude: address.latitude || 0,
					longitude: address.longitude || 0,
					locationType: address.locationType || ""
				}))
			: []

	return shapedAddressList
}
export const getFarmerAddressListUseCase = async (
	farmerId?: string,
	locationType?: string
) => {
	const session = await auth()

	let finalFarmerId = session?.user.farmerId
	if (!finalFarmerId) {
		finalFarmerId = farmerId
	}

	const locationTypeFilter = locationType ? { locationType } : {}

	const addressList = await db.address.findMany({
		where: {
			farmerId: finalFarmerId,
			...locationTypeFilter
		},
		select: {
			id: true,
			fullAddress: true,
			latitude: true,
			longitude: true,
			label: true,
			locationType: true,
			contactName: true,
			contactNumber: true,
			note: true,
			isDefault: true
		}
	})

	const shapedAddressList =
		addressList.length > 0
			? addressList.map((address) => ({
					id: address.id || "",
					fullAddress: address.fullAddress || "",
					latitude: address.latitude || 0,
					longitude: address.longitude || 0,
					label: address.label || "",
					locationType: address.locationType || "",
					contactName: address.contactName || "",
					contactNumber: address.contactNumber || "",
					note: address.note || "",
					isDefault: address.isDefault || false
				}))
			: []

	return shapedAddressList
}
