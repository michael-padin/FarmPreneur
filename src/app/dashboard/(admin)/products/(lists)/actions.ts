"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { deleteProductsByIdUseCase } from "@/use-cases/products"
import { revalidatePath } from "next/cache"

export const deleteProducts = async (ids: string[]) => {
	try {
		await deleteProductsByIdUseCase(ids)
		revalidatePath("/dashboard/products")
		return {
			error: null
		}
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
