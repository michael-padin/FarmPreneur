import { getVerificationDocumentByUserId } from "@/data-access/verification-document"

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
