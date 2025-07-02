"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import { Session } from "next-auth"
import Link from "next/link"
import { useEffect, useState } from "react"

interface LoginStatusIndicatorProps {
	user?: Session["user"]
}

export function LoginStatusIndicator({ user }: LoginStatusIndicatorProps) {
	const [mounted, setMounted] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setMounted(true)
		// Add a slight delay before showing the indicator for a smooth entrance
		const timer = setTimeout(() => {
			setIsVisible(true)
		}, 500)

		return () => clearTimeout(timer)
	}, [])

	// Don't render anything during SSR to prevent hydration mismatch
	if (!mounted) return null

	if (!user) return null

	// Get first letter of name or email for avatar fallback
	const getInitials = () => {
		if (user.name) {
			return user.name.charAt(0).toUpperCase()
		}
		if (user.email) {
			return user.email.charAt(0).toUpperCase()
		}
		return "U"
	}

	return (
		<Link href="/profile">
			<div
				className={cn(
					"fixed bottom-[80px] right-4 z-50 flex items-center gap-2 rounded-lg border border-border/40 bg-card/95 px-3 py-1.5 text-sm text-card-foreground shadow-md backdrop-blur-sm transition-all duration-300",
					isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
				)}
			>
				<Avatar className="h-6 w-6 border border-muted/30">
					<AvatarImage src={user.image || ""} alt={user.name || "User"} />
					<AvatarFallback className="bg-muted/30 text-xs font-medium text-muted-foreground">
						{getInitials()}
					</AvatarFallback>
				</Avatar>
				<div className="flex items-center gap-1">
					<span className="max-w-[120px] truncate font-medium">
						{user.name || user.email || "Logged In"}
					</span>
					<CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
				</div>
			</div>
		</Link>
	)
}
