import { db } from "@/lib/db"

export const getVerificationDocumentByUserId = async (userId: string) => {
	return await db.verificationDocument.findFirst({
		where: { userId },
		include: {
			image: true
		}
	})
}
