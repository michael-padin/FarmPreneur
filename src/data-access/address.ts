import { db } from "@/lib/db"

export const getFarmerAddresses = async (farmerId: string) => {
	return await db.address.findMany({
		where: {
			farmerId: farmerId
		}
	})
}
