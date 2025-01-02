import { auth } from "@/auth"
import { Greetings } from "./greeting"

export async function GreetingsWrapper() {
	const session = await auth()
	const name = session?.user.farmerName || ""
	return <Greetings name={name} />
}
