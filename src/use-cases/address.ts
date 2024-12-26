import { auth } from "@/auth"
import { db } from "@/lib/db"

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
		isDefault: address.isDefault || false,

		note: address.note || "",
		contactName: address?.contactName || "",
		contactNumber: address?.contactNumber || ""
	}
}
export const getDefaultAddressByCustomerId = async (customerId?: string) => {
	const session = await auth()

	let newCustomerId = session?.user.customerId
	if (!newCustomerId) {
		newCustomerId = customerId
	}

	const address = await db.address.findFirst({
		where: {
			AND: [{ customerId: newCustomerId }, { isDefault: true }]
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
		return null
	}

	return {
		note: address.note || "",
		label: address.label || "",
		id: address.id,
		contactNumber: address.contactNumber || "",
		fullAddress: address.fullAddress || "",
		isDefault: address.isDefault || false,
		contactName: address.contactName || "",
		latitude: address.latitude || 0,
		longitude: address.longitude || 0,
		locationType: address.locationType || ""
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
					note: address.note || "",
					label: address.label || "",
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
