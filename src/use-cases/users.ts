import { createUserCustomer, getUserFarmerById } from "@/data-access/users"

export const getUserFarmerByIdUseCase = async (id: string) => {
	try {
		const user = await getUserFarmerById(id)
		return user
	} catch (error) {
		console.log(error)
		return null
	}
}

export const createUserCustomerUseCase = async (data: {
	email: string
	password: string
	name: string
}) => {
	try {
		await createUserCustomer(data)
	} catch (error) {
		console.log(error)
		return null
	}
}
