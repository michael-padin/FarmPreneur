"use client"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { FarmerApplicationStatus as FarmerApplicationStatusType } from "@prisma/client"
import { CheckCircle, Clock, XCircle } from "lucide-react"

interface FarmerApplicationStatusProps {
	status: FarmerApplicationStatusType
	rejectionReason?: string
	onLogout?: () => void
	backButton?: React.ReactNode
}

export function FarmerApplicationStatus({
	status,
	rejectionReason,
	onLogout,
	backButton
}: FarmerApplicationStatusProps) {
	const statusConfig = {
		[FarmerApplicationStatusType.PENDING]: {
			icon: Clock,
			title: "Waiting for Approval",
			description: "Your account is pending review",
			color: "text-yellow-500",
			bgColor: "bg-yellow-100"
		},
		[FarmerApplicationStatusType.APPROVED]: {
			icon: CheckCircle,
			title: "Application Approved",
			description: "Your farmer account has been activated",
			color: "text-green-500",
			bgColor: "bg-green-100"
		},
		[FarmerApplicationStatusType.REJECTED]: {
			icon: XCircle,
			title: "Application Rejected",
			description: "Your farmer application was not approved",
			color: "text-red-500",
			bgColor: "bg-red-100"
		}
	}

	const config = statusConfig[status]

	return (
		<div className="mx-auto flex w-full max-w-md flex-col items-center">
			{backButton}
			<Card className="w-full">
				<CardHeader className="text-center">
					<div
						className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${config.bgColor}`}
					>
						<config.icon className={`h-12 w-12 ${config.color}`} />
					</div>
					<CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
					<CardDescription className={config.color}>
						{config.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-center text-muted-foreground">
						{status === FarmerApplicationStatusType.PENDING &&
							"Thank you for registering! Our team will review your application shortly. We'll notify you once your account has been approved."}
						{status === FarmerApplicationStatusType.APPROVED &&
							"Congratulations! Your application has been approved. You can now list your products and start selling them."}
						{status === FarmerApplicationStatusType.REJECTED && (
							<>
								We&apos;re sorry, but your application has been rejected.
								{rejectionReason && (
									<span className="mt-2 block font-semibold">
										Reason: {rejectionReason}
									</span>
								)}
							</>
						)}
					</p>
					<div className="space-y-2">
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<CheckCircle className="h-5 w-5 text-green-500" />
							<span>Registration submitted</span>
						</div>
						{status === FarmerApplicationStatusType.PENDING && (
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<Clock className="h-5 w-5 text-yellow-500" />
								<span>Awaiting admin approval</span>
							</div>
						)}
						{status === FarmerApplicationStatusType.APPROVED && (
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<CheckCircle className="h-5 w-5 text-green-500" />
								<span>Admin approval received</span>
							</div>
						)}
						{status === FarmerApplicationStatusType.REJECTED && (
							<div className="">
								<div className="flex items-center space-x-2 text-sm text-muted-foreground">
									<XCircle className="h-5 w-5 text-red-500" />
									<span>Application rejected</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									asChild
									className="mt-4 w-full"
								>
									<a href="mailto:support@farmpreneur.com">Contact support</a>
								</Button>
							</div>
						)}
					</div>
				</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					{status === FarmerApplicationStatusType.PENDING && (
						<p className="text-center text-xs text-muted-foreground">
							Expected approval time: 1-2 business days
						</p>
					)}
					{onLogout && (
						<Button onClick={onLogout} variant="outline" className="w-full">
							Logout
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
