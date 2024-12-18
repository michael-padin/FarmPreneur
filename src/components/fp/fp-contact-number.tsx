"use client"
import { formatPhoneNumberIntl } from "react-phone-number-input"

export const FPContactNumberDisplay = ({
	contactNumber
}: {
	contactNumber: string
}) => {
	return (
		<a href={`tel:${contactNumber}`}>{formatPhoneNumberIntl(contactNumber)}</a>
	)
}
