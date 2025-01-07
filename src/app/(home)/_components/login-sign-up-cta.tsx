import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function LoginSignUpCTA() {
	const session = await auth()

	if (session?.user) return null

	return (
		<div className="flex w-full justify-center gap-3">
			<Button
				size={"lg"}
				asChild
				variant={"outline"}
				className="bg-transparent hover:bg-transparent hover:text-white"
			>
				<Link href="/signup">Sign up</Link>
			</Button>
			<Button
				size={"lg"}
				className="bg-background text-foreground"
				variant={"ghost"}
				asChild
			>
				<Link href={"/login"}>Log in</Link>
			</Button>
		</div>
	)
}
