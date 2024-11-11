"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { editUserSchema, EditUserSchema } from "./_components/validations"
import { updateCustomerByUserIdUseCase } from "@/use-cases/customers"

export const updateCustomer = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	const validatedFields = editUserSchema.safeParse(data)

	if (!validatedFields.success) {
		return {
			error: "Invalid fields"
		}
	}
	try {
		await updateCustomerByUserIdUseCase(data)
		return { error: null, success: true }
	} catch (error) {
		return {
			error: getErrorMessage(error)
		}
	}
}
