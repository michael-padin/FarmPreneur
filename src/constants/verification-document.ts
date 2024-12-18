import { DocumentType } from "@prisma/client"

export const verificationDocumentTypeMap: Record<DocumentType, string> = {
	DRIVER_LICENSE: "Driver's License (LTO)",
	PASSPORT: "Philippine Passport",
	TIN_ID: "Tax Identification Number (TIN)",
	POSTAL_ID: "Postal ID",
	VOTER_ID: "Voter's ID (COMELEC)",
	NATIONAL_ID: "Philippine National ID"
}
export const verificationDocumentTypes = Object.entries(
	verificationDocumentTypeMap
).map(([value, label]) => ({
	label,
	value
}))
