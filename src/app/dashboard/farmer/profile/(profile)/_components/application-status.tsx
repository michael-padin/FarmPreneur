import { auth } from "@/auth"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { FarmerApplicationStatus } from "@prisma/client"
import { CheckCircle, ChevronRight, Clock, XCircle } from "lucide-react"
import Link from "next/link"

const gatFarmerApplicationStatus = async (farmerId: string) => {
	return await db.farmer.findFirst({
		where: {
			id: farmerId
		},
		select: {
			applicationStatus: true
		}
	})
}

export async function ApplicationStatus() {
	const session = await auth()
	const farmerId = session?.user?.farmerId || ""
	const applicationStatus = await gatFarmerApplicationStatus(farmerId)

	if (!applicationStatus) return null

	// creaate a function that would return the account status and the color.
	// if the account status is approved, return green, if it's pending, return yellow
	// if it's not approved or pending, return red.

	const statusConfig = {
		[FarmerApplicationStatus.PENDING]: {
			icon: Clock,
			title: "Pending Review",
			description: "Pending",
			color: "text-yellow-500",
			bgColor: "bg-yellow-100"
		},
		[FarmerApplicationStatus.APPROVED]: {
			icon: CheckCircle,
			title: "Approved",
			description: "Your farmer account has been activated",
			color: "text-green-500",
			bgColor: "bg-green-100"
		},
		[FarmerApplicationStatus.REJECTED]: {
			icon: XCircle,
			title: "Rejected",
			description: "Your farmer application was not approved",
			color: "text-red-500",
			bgColor: "bg-red-100"
		}
	}

	const config = statusConfig[applicationStatus.applicationStatus!]

	return (
		<Link
			href="/dashboard/farmer/application-status"
			className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
		>
			<div className="flex items-center gap-3">
				<config.icon className="h-5 w-5" />
				<span>Application Status</span>
			</div>
			<div className="flex items-center gap-3">
				<span className={cn("text-xs", config.color)}>{config.title}</span>
				<ChevronRight className="h-5 w-5" />
			</div>
		</Link>
	)
}
