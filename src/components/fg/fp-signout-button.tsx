"use client"
import { signOutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export const FPSignOutButton = (props: React.ComponentProps<typeof Button>) => {
	return (
		<form action={signOutAction}>
			<button type="submit" {...props}>
				<LogOut />
				Sign Out
			</button>
		</form>
	)
}
