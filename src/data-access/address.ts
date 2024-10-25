import { Address } from "@/app/dashboard/(admin)/users/(lists)/types"
import { db } from "@/lib/db"

export const upsertAddress = async (
	data: Address & { userId: string; id: string }
) => {
	return await db.address.upsert({
		where: { userId: data.userId },
		create: {
			locationType: data.locationType,
			fullAddress: data.fullAddress,
			street: data.street,
			region: data.region,
			country: data.country,
			postalCode: data.postalCode,
			latitude: data.latitude,
			longitude: data.longitude,
			userId: data.userId
		},
		update: {
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
