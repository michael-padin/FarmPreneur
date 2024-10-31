import { DocumentType } from "@prisma/client"

export { DocumentType }

export const documentLabels: Record<DocumentType, string> = {
	PHILIPPINE_NATIONAL_ID: "Philippine National ID",
	DRIVER_LICENSE: "Driver's License (LTO)",
	PASSPORT: "Philippine Passport",
	SSS_ID: "Social Security System ID",
	TIN_ID: "Tax Identification Number (TIN)",
	UMID: "Unified Multi-Purpose ID",
	PRC_ID: "Professional Regulation Commission ID",
	POSTAL_ID: "Postal ID",
	VOTER_ID: "Voter's ID (COMELEC)",
	SENIOR_CITIZEN_ID: "Senior Citizen ID",
	OFW_ID: "Overseas Filipino Worker ID",
	BUSINESS_PERMIT: "DTI Business Permit",
	MAYORS_PERMIT: "Mayor's Permit",
	BIR_CERTIFICATE: "BIR Certificate",
	BARANGAY_CLEARANCE: "Barangay Clearance",
	CEDULA: "Community Tax Certificate (Cedula)"
}
