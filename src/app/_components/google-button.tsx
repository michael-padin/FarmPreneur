import { signIn } from "@/auth"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const GoogleButton = () => {
	return (
		<form
			action={async () => {
				"use server"
				await signIn("google")
			}}
		>
			<Button variant="outline" className="relative w-full" type="submit">
				<Image
					src="https://authjs.dev/img/providers/google.svg"
					width={20}
					height={20}
					alt="Google"
					className="absolute left-4"
				/>
				Continue with Google
			</Button>
		</form>
	)
}

export default GoogleButton
