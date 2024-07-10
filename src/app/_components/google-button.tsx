import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

const GoogleButton = () => {
	return (
		<form
			action={async () => {
				"use server"
				await signIn("google", {
					redirectTo: "/dashboard/overview",
					redirect: true
				})
			}}
		>
			<Button variant="outline" className="w-full" type="submit">
				Login with Google
			</Button>
		</form>
	)
}

export default GoogleButton
