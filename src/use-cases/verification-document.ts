import { FarmRegistrationSchema } from "@/app/(auth)/(farmer)/farmer-registration/types"
import {
	createVerificationDocument,
	getVerificationDocumentByUserId
} from "@/data-access/verification-document"

export const getVerificationDocumentByUserIdUseCase = async (
	userId: string
) => {
	return await getVerificationDocumentByUserId(userId)
}

export const getVerificationDocumentByIdUseCase = () => {
	return null
}
export const getVerificationDocumentByTypeUseCase = () => {
	return null
}

export const createVerificationDocumentUseCase = async (
	data: FarmRegistrationSchema & { farmerId: string }
) => {
	return await createVerificationDocument(data)
}
