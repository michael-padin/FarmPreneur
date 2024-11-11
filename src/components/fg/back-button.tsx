"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { signOutAction } from "@/actions/auth"

type BackButtonProps = React.ComponentProps<typeof Button> & {
	fallbackRoute?: string
}

export const BackButton = ({ fallbackRoute, ...props }: BackButtonProps) => {
	const router = useRouter()

	const handleClick = () => {
		if (fallbackRoute) {
			router.push(fallbackRoute)
		} else {
			router.back()
		}
	}

	return (
		<Button
			onClick={handleClick}
			variant="ghost"
			size="icon"
			className={cn("", props.className)}
			{...props}
		>
			<ArrowLeft className="h-4 w-4" />
		</Button>
	)
}

export const BackButtonLogout = (
	props: React.ComponentProps<typeof Button>
) => {
	return (
		<form action={signOutAction}>
			<Button
				variant="ghost"
				size="icon"
				className={cn("", props.className)}
				{...props}
			>
				<ArrowLeft />
			</Button>
		</form>
	)
}
