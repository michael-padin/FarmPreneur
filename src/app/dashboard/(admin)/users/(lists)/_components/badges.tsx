"use client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FarmerApplicationStatus, ROLE } from "@prisma/client"
import {
	CheckCircle,
	Shield,
	ShoppingCart,
	Tractor,
	XCircle
} from "lucide-react"

export const RoleBadge = ({
	role,
	className
}: {
	role: ROLE
	className?: string
}) => {
	const getRoleStyles = (role: ROLE) => {
		switch (role) {
			case "ADMIN":
				return "bg-purple-100 text-purple-800 hover:bg-purple-200"
			case "CUSTOMER":
				return "bg-blue-100 text-blue-800 hover:bg-blue-200"
			case "FARMER":
				return "bg-green-100 text-green-800 hover:bg-green-200"
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-200"
		}
	}

	const getRoleIcon = (role: ROLE) => {
		switch (role) {
			case "ADMIN":
				return <Shield className="mr-1 h-4 w-4" />
			case "CUSTOMER":
				return <ShoppingCart className="mr-1 h-4 w-4" />
			case "FARMER":
				return <Tractor className="mr-1 h-4 w-4" />
			default:
				return null
		}
	}

	return (
		<Badge
			variant="secondary"
			className={cn(
				"flex items-center gap-1 px-2 py-1 capitalize",
				getRoleStyles(role),
				className
			)}
		>
			{getRoleIcon(role)}
			{role}
		</Badge>
	)
}

export const VerificationBadge = ({
	isEmailVerified,
	className
}: {
	isEmailVerified: boolean
	className?: string
}) => {
	return (
		<Badge
			variant="secondary"
			className={cn(
				"flex items-center gap-1 px-2 py-1",
				isEmailVerified
					? "bg-green-100 text-green-800 hover:bg-green-200"
					: "bg-red-100 text-red-800 hover:bg-red-200",
				className
			)}
		>
			{isEmailVerified ? (
				<>
					<CheckCircle className="h-4 w-4" />
					Verified
				</>
			) : (
				<>
					<XCircle className="h-4 w-4" />
					Unverified
				</>
			)}
		</Badge>
	)
}

interface FarmerApprovalBadgeProps {
	status: FarmerApplicationStatus
	className?: string
}

export const FarmerApprovalBadge = ({
	status,
	className
}: FarmerApprovalBadgeProps) => {
	const getStatusStyles = (status: FarmerApplicationStatus) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
			case "APPROVED":
				return "bg-green-100 text-green-800 hover:bg-green-200"
			case "REJECTED":
				return "bg-red-100 text-red-800 hover:bg-red-200"
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-200"
		}
	}

	return (
		<Badge
			variant="secondary"
			className={cn(getStatusStyles(status), className)}
		>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</Badge>
	)
}
