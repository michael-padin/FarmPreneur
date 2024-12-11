"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
	const router = useRouter()
	return (
		<button
			className="cursor-pointer hover:bg-transparent hover:text-current"
			onClick={() => router.back()}
		>
			<ArrowLeft className="h-6 w-6" />
		</button>
	)
}
