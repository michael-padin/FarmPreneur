"use client"

import { useEffect, useState } from "react"

type JsonLdProps = {
	data: object | object[]
}

export default function JsonLd({ data }: JsonLdProps) {
	const [markup, setMarkup] = useState("")

	useEffect(() => {
		setMarkup(JSON.stringify(data))
	}, [data])

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: markup }}
		/>
	)
}
