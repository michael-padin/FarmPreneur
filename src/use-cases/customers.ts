import { EditUserSchema } from "@/app/dashboard/(admin)/users/[id]/edit/_components/validations"
import { getCustomers, updateCustomerByUserId } from "@/data-access/customers"

export const getCustomersUseCase = async () => {
	return await getCustomers()
}

export const updateCustomerByUserIdUseCase = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	return await updateCustomerByUserId(data)
}
