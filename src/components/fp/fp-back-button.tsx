"use client"

import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const FPBackButton = ({
	className,
	containerClassName,
	iconClassName
}: {
	iconClassName?: string
	className?: string
	containerClassName?: string
}) => {
	const router = useRouter()

	return (
		<div className={containerClassName}>
			<button
				className={cn(
					"relative flex items-center justify-center rounded-full p-1.5",
					className
				)}
				onClick={() => router.back()}
			>
				<ArrowLeft className={cn("h-6 w-6", iconClassName)} />
				<span className="sr-only">Go back</span>
			</button>
		</div>
	)
}
export const FPLinkBackButton = ({
	className,
	containerClassName,
	iconClassName,
	href
}: {
	href: string
	iconClassName?: string
	className?: string
	containerClassName?: string
}) => {
	return (
		<div className={containerClassName}>
			<Link
				href={href}
				className={cn(
					"relative flex items-center justify-center rounded-full p-1.5",
					className
				)}
			>
				<ArrowLeft className={cn("h-6 w-6", iconClassName)} />
				<span className="sr-only">Go back</span>
			</Link>
		</div>
	)
}
