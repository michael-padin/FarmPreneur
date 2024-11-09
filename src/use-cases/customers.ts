import { getCustomers } from "@/data-access/customers"

export const getCustomersUseCase = async () => {
	return await getCustomers()
}
