import React from "react"
import {
	Bell,
	Trash2,
	CheckCircle2,
	AlertCircle,
	MessageCircle,
	Package,
	Gift,
	Filter,
	Search,
	MoreVertical,
	Eye,
	ArrowUpDown,
	ChevronDown,
	X,
	RefreshCw
} from "lucide-react"
import { format } from "date-fns"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter
} from "@/components/ui/dialog"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

export const NotifUi2 = () => {
	const [selectedType, setSelectedType] = React.useState("ALL")
	const [searchQuery, setSearchQuery] = React.useState("")
	const [showFilters, setShowFilters] = React.useState(false)
	const [selectedNotification, setSelectedNotification] = React.useState(null)

	// Mock data - replace with actual API call
	const notifications = [
		{
			id: "1",
			type: "ORDER_STATUS",
			message: "Order #1234 status changed to COMPLETED",
			isRead: false,
			createdAt: new Date(),
			userId: "user123",
			userRole: "CUSTOMER",
			details:
				"Customer: John Doe\nOrder Total: $156.78\nDelivery Address: 123 Main St"
		},
		{
			id: "2",
			type: "VERIFICATION",
			message: "New farmer verification request from John Doe",
			isRead: true,
			createdAt: new Date(Date.now() - 86400000),
			userId: "farmer456",
			userRole: "FARMER",
			details:
				"Farm Name: Green Acres\nDocument Type: Business License\nSubmission Date: 2024-03-15"
		}
	]

	const notificationTypes = {
		ORDER_STATUS: {
			icon: Package,
			color: "bg-blue-100 text-blue-700",
			action: "View Order"
		},
		NEW_MESSAGE: {
			icon: MessageCircle,
			color: "bg-purple-100 text-purple-700",
			action: "Reply"
		},
		NEW_PRODUCT: {
			icon: Package,
			color: "bg-green-100 text-green-700",
			action: "Review"
		},
		PROMOTION: {
			icon: Gift,
			color: "bg-yellow-100 text-yellow-700",
			action: "Edit"
		},
		SYSTEM_ALERT: {
			icon: AlertCircle,
			color: "bg-red-100 text-red-700",
			action: "Acknowledge"
		},
		VERIFICATION: {
			icon: CheckCircle2,
			color: "bg-teal-100 text-teal-700",
			action: "Verify"
		}
	}

	const getNotificationIcon = (type) => {
		const IconComponent = notificationTypes[type]?.icon || Bell
		return <IconComponent className="h-4 w-4" />
	}

	const QuickActions = ({ notification, isMobile = false }) => {
		const actionType = notificationTypes[notification.type]?.action

		return (
			<div
				className={`flex ${isMobile ? "flex-col space-y-2" : "flex-row space-x-2"}`}
			>
				<Button
					variant="default"
					size={isMobile ? "sm" : "xs"}
					className="whitespace-nowrap"
					onClick={() => {
						/* Handle primary action */
					}}
				>
					{actionType}
				</Button>
				{!notification.isRead && (
					<Button
						variant="secondary"
						size={isMobile ? "sm" : "xs"}
						onClick={() => {
							/* Mark as read */
						}}
					>
						Mark Read
					</Button>
				)}
				<Button
					variant="destructive"
					size={isMobile ? "sm" : "xs"}
					onClick={() => {
						/* Delete */
					}}
				>
					Delete
				</Button>
			</div>
		)
	}

	// Mobile notification card component
	const NotificationCard = ({ notification }) => (
		<Card className="mb-4">
			<CardHeader className="p-4">
				<div className="flex items-start justify-between">
					<div className="flex items-center space-x-3">
						<div
							className={`rounded-full p-2 ${notificationTypes[notification.type]?.color}`}
						>
							{getNotificationIcon(notification.type)}
						</div>
						<div>
							<p className="text-sm font-medium">{notification.message}</p>
							<p className="text-xs text-gray-500">
								{format(notification.createdAt, "MMM d, yyyy h:mm a")}
							</p>
						</div>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0"
						onClick={() => setSelectedNotification(notification)}
					>
						<Eye className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<div className="mb-3 flex flex-wrap gap-2">
					{getRoleBadge(notification.userRole)}
					{getStatusBadge(notification.isRead)}
				</div>
				<QuickActions notification={notification} isMobile={true} />
			</CardContent>
		</Card>
	)

	const getStatusBadge = (isRead) => (
		<Badge variant={isRead ? "secondary" : "default"}>
			{isRead ? "Read" : "Unread"}
		</Badge>
	)

	const getRoleBadge = (role) => {
		const variants = {
			FARMER: "destructive",
			CUSTOMER: "secondary",
			ADMIN: "outline"
		}

		return (
			<Badge variant={variants[role] || "default"}>{role.toLowerCase()}</Badge>
		)
	}

	// Mobile filters sheet
	const FiltersSheet = () => (
		<Sheet open={showFilters} onOpenChange={setShowFilters}>
			<SheetContent side="bottom" className="h-[80vh]">
				<SheetHeader>
					<SheetTitle>Filter Notifications</SheetTitle>
					<SheetDescription>Customize your notification view</SheetDescription>
				</SheetHeader>
				<div className="py-4">
					<div className="space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium">Type</label>
							<Select value={selectedType} onValueChange={setSelectedType}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">All Types</SelectItem>
									{Object.keys(notificationTypes).map((type) => (
										<SelectItem key={type} value={type}>
											{type.replace("_", " ")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium">
								Date Range
							</label>
							<div className="grid grid-cols-2 gap-2">
								<Input type="date" className="w-full" />
								<Input type="date" className="w-full" />
							</div>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium">Status</label>
							<Select>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">All</SelectItem>
									<SelectItem value="READ">Read</SelectItem>
									<SelectItem value="UNREAD">Unread</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
					<div className="flex space-x-2">
						<Button
							variant="outline"
							className="flex-1"
							onClick={() => setShowFilters(false)}
						>
							Cancel
						</Button>
						<Button className="flex-1">Apply Filters</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)

	// Notification detail dialog
	const NotificationDetailDialog = () => (
		<Dialog
			open={!!selectedNotification}
			onOpenChange={() => setSelectedNotification(null)}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Notification Details</DialogTitle>
				</DialogHeader>
				{selectedNotification && (
					<div className="space-y-4">
						<div className="flex items-center space-x-3">
							<div
								className={`rounded-full p-2 ${notificationTypes[selectedNotification.type]?.color}`}
							>
								{getNotificationIcon(selectedNotification.type)}
							</div>
							<div>
								<h4 className="font-medium">{selectedNotification.message}</h4>
								<p className="text-sm text-gray-500">
									{format(selectedNotification.createdAt, "PPpp")}
								</p>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex gap-2">
								{getRoleBadge(selectedNotification.userRole)}
								{getStatusBadge(selectedNotification.isRead)}
							</div>
							<pre className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm">
								{selectedNotification.details}
							</pre>
						</div>
						<DialogFooter>
							<QuickActions
								notification={selectedNotification}
								isMobile={true}
							/>
						</DialogFooter>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)

	return (
		<div className="w-full">
			{/* Mobile Header */}
			<div className="space-y-4 p-4 lg:hidden">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold">Notifications</h1>
					<div className="flex space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowFilters(true)}
						>
							<Filter className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm">
							<RefreshCw className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<Input
					placeholder="Search notifications..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full"
					icon={Search}
				/>
			</div>

			{/* Desktop View */}
			<div className="hidden lg:block">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Notification Management</CardTitle>
								<CardDescription>
									Manage and monitor all system notifications
								</CardDescription>
							</div>
							<div className="flex items-center space-x-2">
								<Button variant="outline" onClick={() => setShowFilters(true)}>
									<Filter className="mr-2 h-4 w-4" />
									Filters
								</Button>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline">
											<Bell className="mr-2 h-4 w-4" />
											Actions
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<CheckCircle2 className="mr-2 h-4 w-4" />
											Mark All as Read
										</DropdownMenuItem>
										<DropdownMenuItem className="text-red-600">
											<Trash2 className="mr-2 h-4 w-4" />
											Clear All
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<div className="mt-4 flex items-center space-x-2">
							<Input
								placeholder="Search notifications..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="max-w-sm"
							/>
							<Select value={selectedType} onValueChange={setSelectedType}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filter by type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">All Types</SelectItem>
									{Object.keys(notificationTypes).map((type) => (
										<SelectItem key={type} value={type}>
											{type.replace("_", " ")}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardHeader>

					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[100px]">Type</TableHead>
										<TableHead>Message</TableHead>
										<TableHead>User Role</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Date</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{notifications.map((notification) => (
										<TableRow key={notification.id}>
											<TableCell>
												<div
													className={`inline-flex items-center justify-center rounded-full p-2 ${notificationTypes[notification.type]?.color}`}
												>
													{getNotificationIcon(notification.type)}
												</div>
											</TableCell>
											<TableCell className="font-medium">
												{notification.message}
											</TableCell>
											<TableCell>
												{getRoleBadge(notification.userRole)}
											</TableCell>
											<TableCell>
												{getStatusBadge(notification.isRead)}
											</TableCell>
											<TableCell>
												{format(notification.createdAt, "MMM d, yyyy h:mm a")}
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm">
															Actions
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem>View Details</DropdownMenuItem>
														<DropdownMenuItem>Mark as Read</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="text-red-600">
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
