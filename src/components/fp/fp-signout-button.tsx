"use client"
import { signOutAction } from "@/app/actions/auth"
import { LogOut } from "lucide-react"

interface FPSignOutButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	showIcon?: boolean
	text?: string
}

export const FPSignOutButton = ({
	showIcon,
	text = "Sign Out",
	...props
}: FPSignOutButtonProps) => {
	return (
		<form action={signOutAction}>
			<button {...props}>
				{showIcon && <LogOut className="h-5 w-5" />}
				{text}
			</button>
		</form>
	)
}
