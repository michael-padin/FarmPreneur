"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { deleteUsersByIdUseCase } from "@/use-cases/users"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { UpdateUserTypes, updateUserSchema } from "./types"

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
		console.log("error :>> ", error)
		return {
			data: null,
			error: getErrorMessage(error)
		}
	}
}
