"use client"
import * as React from "react"
import { formatPhoneNumber } from "react-phone-number-input"

export const FPContactNumberDisplay = ({
	contactNumber
}: {
	contactNumber: string
}) => {
	return (
		<a href={`tel:${formatPhoneNumber(contactNumber)}   }`}>
			{formatPhoneNumber(contactNumber)}
		</a>
	)
}
