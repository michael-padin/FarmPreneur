import { getFirstWord } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"

export function Greetings({ name }: { name: string }) {
	const [greeting, setGreeting] = useState("")

	const updateGreeting = useCallback(() => {
		const hour = new Date().getHours()
		let newGreeting

		if (hour >= 5 && hour < 12) {
			newGreeting = "Good morning"
		} else if (hour >= 12 && hour < 17) {
			newGreeting = "Good afternoon"
		} else if (hour >= 17 && hour < 22) {
			newGreeting = "Good evening"
		} else {
			newGreeting = "Good night"
		}

		setGreeting(newGreeting)
	}, [])

	useEffect(() => {
		// Initial update
		updateGreeting()

		// Update greeting every minute
		const interval = setInterval(updateGreeting, 60000)

		// Cleanup interval on unmount
		return () => clearInterval(interval)
	}, [updateGreeting])

	return (
		<h2 className="text-2xl font-semibold leading-none tracking-tight">{`${greeting}, ${getFirstWord(name)} 👋`}</h2>
	)
}
