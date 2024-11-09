import { getCustomers } from "@/data-access/customers"
import { transformCustomerRecord } from "@/utils/transform"

export const getCustomersUseCase = async () => {
	return await getCustomers()
}
