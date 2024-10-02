import { db } from "@/lib/db"

export const getUserById = async (id: string) => {
	const user = await db.user.findUnique({
		where: {
			id: id
		}
	})
	const { password, ...newUser } = user!
	return newUser
}

export const getUserByEmail = async (email: string) => {
	const user = await db.user.findUnique({
		where: {
			email: email
		}
	})

	const { password, ...newUser } = user!
	return newUser
}
