import { Address } from "@/app/dashboard/(admin)/users/(lists)/types"
import { db } from "@/lib/db"
import { AddressSchema } from "@/validations/address"

// create crud for address here please
export const getAddress = async (id: string) => {
	return await db.address.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			fullAddress: true,
			street: true,
			region: true,
			country: true,
			postalCode: true,
			latitude: true,
			longitude: true,
			locationType: true
		}
	})
}

export const createAddress = async (data: Address) => {
	return await db.address.create({
		data: {
			locationType: data.locationType,
			fullAddress: data.fullAddress,
			street: data.street,
			region: data.region,
			country: data.country,
			postalCode: data.postalCode,
			latitude: data.latitude,
			longitude: data.longitude,
			userId: ""
		}
	})
}

export const updateAddress = async (data: Address & { id: string }) => {
	return await db.address.update({
		where: {
			id: data.id
		},
		data: {
			locationType: data.locationType,
			fullAddress: data.fullAddress,
			street: data.street,
			region: data.region,
			country: data.country,
			postalCode: data.postalCode,
			latitude: data.latitude,
			longitude: data.longitude
		}
	})
}

export const deleteAddress = async (id: string) => {
	return await db.address.delete({
		where: {
			id: id
		}
	})
}

export const createFarmDetailsAddress = async (
	data: AddressSchema & { farmDetailsId: string }
) => {
	return await db.address.create({ data })
}
