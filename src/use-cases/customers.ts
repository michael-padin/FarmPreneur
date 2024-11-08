import { getCustomers } from "@/data-access/customers"
import { transformCustomerRecord } from "@/utils/transform"

export const getCustomersUseCase = async () => {
	const customers = await getCustomers()
	return customers.map(transformCustomerRecord)
}
