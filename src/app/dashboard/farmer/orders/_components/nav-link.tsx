import { FPMessageCircleMore } from "@/components/fp/fp-message-circle-more"
import { cn } from "@/lib/utils"

export function OrderNavLink() {
	const containerClasses = cn("bg-transparent text-primary")
	const badgeClasses = cn("bg-primary text-white")
	return (
		<div className="flex gap-3">
			<FPMessageCircleMore
				url="/dashboard/farmer/messages"
				className={badgeClasses}
				containerClassName={containerClasses}
			/>
		</div>
	)
}
