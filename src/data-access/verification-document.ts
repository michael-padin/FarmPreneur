import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { db } from "@/lib/db"

export const createVerificationDocument = async (
	data: FarmRegistrationSchema & { farmerId: string }
) => {
	return await db.verificationDocument.create({
		data: {
			type: data.documentVerification.type,
			image: data.documentVerification.image.url,
			farmer: {
				connect: {
					id: data.farmerId
				}
			}
		}
	})
}
