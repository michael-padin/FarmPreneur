import { auth } from "@/auth"
import { getFirstWord } from "@/lib/utils"

export async function Greetings() {
	const session = await auth()
	const name = session?.user.name || ""

	const getGreeting = () => {
		const currentHour = new Date().getHours()

		if (currentHour < 12) return "Good Morning"
		if (currentHour < 18) return "Good Afternoon"
		return "Good Evening"
	}

	return (
		<h2 className="text-2xl font-semibold leading-none tracking-tight">{`${getGreeting()}, ${getFirstWord(name)} 👋`}</h2>
	)
}
