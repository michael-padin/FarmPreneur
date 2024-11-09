import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import { db } from "@/lib/db"

export const getVerificationDocumentByUserId = async (userId: string) => {
	return await db.verificationDocument.findFirst({
		where: { userId },
		include: {
			image: true
		}
	})
}

export const createVerificationDocument = async (
	data: FarmRegistrationSchema & { farmerId: string }
) => {
	return await db.verificationDocument.create({
		data: {
			type: data.documentVerification.type,
			image: {
				create: {
					url: data.documentVerification.image.url,
					filename: data.documentVerification.image.filename,
					size: data.documentVerification.image.size,
					mimeType: data.documentVerification.image.mimeType,
					type: "VERIFICATION"
				}
			},
			farmer: {
				connect: {
					id: data.farmerId
				}
			}
		}
	})
}
