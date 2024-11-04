"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export const BackButton = (props: React.ComponentProps<typeof Button>) => {
	const router = useRouter()

	return (
		<Button
			onClick={() => router.back()}
			variant="ghost"
			size="icon"
			className={cn("", props.className)}
			{...props}
		>
			<ArrowLeft />
		</Button>
	)
}
