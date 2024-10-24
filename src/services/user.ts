import { db } from "@/lib/db"

export const getUserByEmail = async (email: string) => {
	try {
		const user = db.user.findUnique({
			where: { email },
			cacheStrategy: {
				ttl: 60
			}
		})
		return user
	} catch (error) {
		return null
	}
}
