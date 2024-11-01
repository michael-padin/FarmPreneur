"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { deleteProductsByIdUseCase } from "@/use-cases/products"

export const deleteProducts = async ({ ids }: { ids: string[] }) => {
	try {
		await deleteProductsByIdUseCase(ids)
		return {
			error: null
		}
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
