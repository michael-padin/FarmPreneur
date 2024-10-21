"use server"
import { revalidatePath } from "next/cache"
import { updateUserUseCase } from "@/use-cases/users"
import { UpdateUserTypes, updateUserSchema } from "./types"
import { getErrorMessage } from "@/lib/handle-error"
import { hash } from "bcryptjs"

export const updateUser = async (user: UpdateUserTypes & { id: string }) => {
	const parsedData = updateUserSchema.safeParse(user)

	console.log(user)

	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}

	let hashedPassword = null

	try {
		if (user.password) {
			hashedPassword = await hash(user.password, 10)
		}
		await updateUserUseCase({ ...user, password: hashedPassword })
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
