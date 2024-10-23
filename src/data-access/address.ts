import { Address } from "@/app/dashboard/@admin/users/types"
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
			city: data.city,
			state: data.state,
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
			city: data.city,
			state: data.state,
			country: data.country,
			postalCode: data.postalCode,
			latitude: data.latitude,
			longitude: data.longitude
		}
	})
}
