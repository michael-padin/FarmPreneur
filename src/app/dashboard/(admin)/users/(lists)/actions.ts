"use server"
import { revalidatePath } from "next/cache"
import { deleteUsersByIdUseCase, updateUserUseCase } from "@/use-cases/users"
import { UpdateUserTypes, updateUserSchema } from "./types"
import { getErrorMessage } from "@/lib/handle-error"
import { hash } from "bcryptjs"

export const updateUser = async (
	user: UpdateUserTypes & {
		id: string
		address: {
			userId: string
			id: string
		}
	}
) => {
	const parsedData = updateUserSchema.safeParse(user)

	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}

	let hashedPassword = null

	try {
		if (user.password) {
			hashedPassword = await hash(user.password, 10)
		}

		revalidatePath("/dashboard/users")
		return {
			data: null,
			error: null
		}
	} catch (error) {
		console.log(error)

		return {
			data: null,
			error: getErrorMessage(error)
		}
	}
}

export const deleteUsers = async ({ ids }: { ids: string[] }) => {
	try {
		await deleteUsersByIdUseCase(ids)
		revalidatePath("/dashboard/users")
		return {
			data: null,
			error: null
		}
	} catch (error) {
		return {
			data: null,
			error: getErrorMessage(error)
		}
	}
}
