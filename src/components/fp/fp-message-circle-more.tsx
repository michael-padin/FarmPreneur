"use client"

import { cn } from "@/lib/utils"
import { MessageCircleMore } from "lucide-react"
import { motion, useAnimation } from "motion/react"
import Link from "next/link"
import { useEffect, useRef } from "react"

export const FPMessageCircleMore = ({
	className,
	containerClassName,
	iconClassName
}: {
	iconClassName?: string
	className?: string
	containerClassName?: string
}) => {
	const messageCount = 0
	const prevMessageCountRef = useRef(0)
	const controls = useAnimation()

	useEffect(() => {
		if (messageCount && messageCount !== prevMessageCountRef.current) {
			controls.start({
				scale: [1, 1.2, 1],
				transition: { duration: 0.3 }
			})
		}
	}, [messageCount, controls])

	return (
		<Link
			href={`/messages`}
			className="cursor-pointer hover:bg-transparent hover:text-current"
		>
			<motion.div
				className={cn(
					"relative flex items-center justify-center rounded-full p-1.5",
					containerClassName
				)}
				animate={controls}
			>
				<MessageCircleMore className={cn("h-6 w-6", iconClassName)} />
				{messageCount > 0 && (
					<span
						className={cn(
							"absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-medium text-primary-foreground",
							className
						)}
					>
						{messageCount}
					</span>
				)}
			</motion.div>
		</Link>
	)
}
