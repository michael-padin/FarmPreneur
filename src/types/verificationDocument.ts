import { DocumentType } from "@prisma/client"

export { DocumentType }

export const documentLabels: Record<DocumentType, string> = {
	DRIVER_LICENSE: "Driver's License (LTO)",
	PASSPORT: "Philippine Passport",
	TIN_ID: "Tax Identification Number (TIN)",
	POSTAL_ID: "Postal ID",
	VOTER_ID: "Voter's ID (COMELEC)",
	NATIONAL_ID: "Philippine National ID"
}
export const documentOptions = Object.entries(documentLabels).map(
	([value, label]) => ({
		label,
		value
	})
)
