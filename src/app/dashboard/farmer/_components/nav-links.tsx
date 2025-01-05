import { FPMessageCircleMore } from "@/components/fp/fp-message-circle-more"
import { cn } from "@/lib/utils"

export function FarmerDashboardNavLink() {
	const containerClasses = cn("bg-transparent text-primary")
	const badgeClasses = cn("bg-primary text-white")
	return (
		<div className="flex gap-3">
			<FPMessageCircleMore
				url="/dashboard/farmer/messages"
				className={badgeClasses}
				iconClassName="h-8 w-8"
				containerClassName={containerClasses}
			/>
		</div>
	)
}
