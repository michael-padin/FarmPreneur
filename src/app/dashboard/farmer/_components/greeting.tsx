import { auth } from "@/auth"
import { getFirstWord } from "@/lib/utils"

export async function Greetings() {
	const session = await auth()
	const name = session?.user.farmerName || ""

	const getGreeting = () => {
		const currentHour = new Date().getHours()

		// Use inclusive ranges for clarity
		if (currentHour >= 5 && currentHour < 12) return "Good Morning" // Morning: 5 AM - 11:59 AM
		if (currentHour >= 12 && currentHour < 17) return "Good Afternoon" // Afternoon: 12 PM - 4:59 PM
		if (currentHour >= 17 && currentHour < 21) return "Good Evening" // Evening: 5 PM - 8:59 PM
		return "Good Night" // Night: 9 PM - 4:59 AM
	}

	return (
		<h2 className="text-2xl font-semibold leading-none tracking-tight">{`${getGreeting()}, ${getFirstWord(name)} 👋`}</h2>
	)
}
