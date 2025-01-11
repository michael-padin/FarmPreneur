import { auth } from "@/auth"
import { Greetings } from "../../../farmer/_components/greeting"

export async function GreetingsWrapper() {
	const session = await auth()
	const name = session?.user.name || ""
	return <Greetings name={name} />
}
