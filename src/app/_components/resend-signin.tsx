import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"

export function ResendSignIn() {
	return (
		<form
			action={async (formData) => {
				"use server"
				await signIn("resend")
			}}
		>
			<Input type="text" name="email" placeholder="Email" />
			<Button type="submit">Signin with Resend</Button>
		</form>
	)
}
