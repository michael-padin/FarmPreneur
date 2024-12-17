"use client"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { orderStatusMap } from "@/constants/order"
import { cn } from "@/lib/utils"
import {
	FarmerApplicationStatus,
	OrderStatus,
	ProductListingStatus,
	ROLE
} from "@prisma/client"
import {
	CheckCircle,
	Shield,
	ShoppingCart,
	Tractor,
	XCircle
} from "lucide-react"

export const RoleBadge = ({
	role,
	className,
	props
}: {
	role: ROLE
	className?: string
	props?: BadgeProps
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
			{...props}
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
interface ProductListingStatusBadgeProps {
	status: ProductListingStatus
	className?: string
	showText?: boolean
}

export const ProductListingStatusBadge = ({
	status,
	className,
	showText = false
}: ProductListingStatusBadgeProps) => {
	const getStatusStyles = (status: ProductListingStatus) => {
		switch (status) {
			case "PENDING":
				return `text-yellow-800  ${showText ? "bg-yellow-100" : "bg-yellow-200"} hover:bg-yellow-200`
			case "APPROVED":
				return `text-green-800 ${showText ? "bg-green-100" : "bg-green-200"} hover:bg-green-200`
			case "REJECTED":
				return `text-red-800 ${showText ? "bg-red-100" : "bg-red-200"} hover:bg-red-200`
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-200"
		}
	}

	return (
		<Badge
			variant="secondary"
			className={cn(getStatusStyles(status), className)}
		>
			{showText && status.charAt(0).toUpperCase() + status.slice(1)}
		</Badge>
	)
}

interface OrderStatusBadgeProps {
	status: OrderStatus
	className?: string
	showText?: boolean
}

export const OrderStatusBadge = ({
	status,
	className,
	showText
}: OrderStatusBadgeProps) => {
	const getStatusStyles = (status: OrderStatus) => {
		switch (status) {
			case "PENDING":
				return `text-yellow-600  ${showText ? "bg-yellow-100" : "bg-yellow-200"} hover:bg-yellow-200`
			case "IN_PROGRESS":
				return `text-blue-600  ${showText ? "bg-blue-100" : "bg-blue-200"} hover:bg-blue-200`
			case "COMPLETED":
				return `text-green-600 ${showText ? "bg-green-100" : "bg-green-200"} hover:bg-green-200`
			case "CANCELLED":
				return `text-red-600 ${showText ? "bg-red-100" : "bg-red-200"} hover:bg-red-200`
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-200"
		}
	}

	return (
		<Badge className={cn(getStatusStyles(status), className)}>
			{showText && orderStatusMap[status]}
		</Badge>
	)
}
