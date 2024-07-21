import React from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IconBadgeProps {
	icon: LucideIcon
	count?: number
	badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
	badgeColor?: string
	showZero?: boolean
	className?: string
	iconColor?: string
	size?: "default" | "sm" | "lg" | "icon"
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
}

export default function IconBadge({
	icon: Icon,
	count = 0,
	badgePosition = "top-right",
	badgeColor = "bg-white text-primary",
	showZero = false,
	className,
	iconColor = "",
	size = "icon",
	variant = "outline"
}: IconBadgeProps) {
	const positions = {
		"top-right": "-top-1 -right-1",
		"top-left": "-top-1 -left-1",
		"bottom-right": "-bottom-2 -right-2",
		"bottom-left": "-bottom-2 -left-2"
	}

	return (
		<Button
			variant={variant}
			size={size}
			className={cn("relative hover:bg-transparent", className)}
		>
			<Icon className={cn("relative hover:bg-transparent", iconColor)} />
			{(count > 0 || showZero) && (
				<span
					className={cn(
						"absolute flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-medium",
						positions[badgePosition],
						badgeColor
					)}
				>
					{count}
				</span>
			)}
			<span className="sr-only">Icon with count {count}</span>
		</Button>
	)
}
