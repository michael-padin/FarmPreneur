"use client"
import { signOutAction } from "@/actions/auth"
import { LogOut } from "lucide-react"

export const FPSignOutButton = (
	props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
	return (
		<form action={signOutAction}>
			<button {...props}>
				<LogOut />
				Sign Out
			</button>
		</form>
	)
}
