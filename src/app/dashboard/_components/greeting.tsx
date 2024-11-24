"use client"
import { getFirstWord } from "@/lib/utils"
import { useSession } from "next-auth/react"
import React, { useCallback } from "react"

export function Greetings() {
	const session = useSession()
	const name = session?.data?.user.name || "User"
	const getGreeting = useCallback(() => {
		const currentHour = new Date().getHours()

		if (currentHour < 12) return "Good Morning"
		if (currentHour < 18) return "Good Afternoon"
		return "Good Evening"
	}, [])

	return (
		<h2 className="text-2xl font-semibold leading-none tracking-tight">{`${getGreeting()}, ${getFirstWord(name)} 👋`}</h2>
	)
}
