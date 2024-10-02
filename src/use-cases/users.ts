import { getUserFarmerById } from "@/data-access/users"
import { db } from "@/lib/db"

export const getUserFarmerByIdUseCase = async (id: string) => {
	try {
		const user = await getUserFarmerById(id)
		return user
	} catch (error) {
		console.log(error)
		return null
	}
}
