import {
	Search,
	SlidersHorizontal,
	Mail,
	Phone,
	Calendar,
	MapPin,
	CheckCircle,
	Clock,
	MoreVertical,
	Eye,
	ThumbsUp,
	ThumbsDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function PendingFarmers() {
	const farmers = [
		{
			name: "Michael Farmer",
			email: "farmer@gmail.com",
			birthDate: "August 21, 2002",
			contact: "+639",
			address: "N/A",
			verificationDocument: "/placeholder.svg?height=300&width=400",
			applicationStatus: "PENDING",
			emailVerified: true,
			createdAt: "December 1, 2024"
		},
		{
			name: "sdf dssdfts",
			email: "sfsd@gmail.com",
			birthDate: "December 2, 2024",
			contact: "+639955143588",
			address: "N/A",
			verificationDocument: "/placeholder.svg?height=300&width=400",
			applicationStatus: "PENDING",
			emailVerified: true,
			createdAt: "December 1, 2024"
		}
	]

	return (
		<div className="container mx-auto space-y-4 p-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Farmers Waiting for Approval</h1>
					<p className="text-sm text-muted-foreground">
						Manage pending farmers
					</p>
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon">
							<SlidersHorizontal className="h-4 w-4" />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Filters</SheetTitle>
						</SheetHeader>
						<div className="mt-4 space-y-4">
							<Input placeholder="Filter by name..." />
							<Input placeholder="Filter by date..." />
						</div>
					</SheetContent>
				</Sheet>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder="Search applications..." className="pl-9" />
			</div>

			<div className="space-y-4">
				{farmers.map((farmer) => (
					<Card key={farmer.email} className="overflow-hidden">
						<CardHeader className="border-b bg-muted/40 p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<CardTitle className="text-base font-medium">
										{farmer.name}
									</CardTitle>
									{farmer.emailVerified && (
										<CheckCircle className="h-4 w-4 text-green-500" />
									)}
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="secondary">{farmer.applicationStatus}</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<ThumbsUp className="mr-2 h-4 w-4" />
												Approve
											</DropdownMenuItem>
											<DropdownMenuItem className="text-destructive">
												<ThumbsDown className="mr-2 h-4 w-4" />
												Reject
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4 p-4">
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.birthDate}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.contact}</span>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.address}</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										Applied:
									</span>
									<span className="text-sm">{farmer.createdAt}</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">
										Verification Document
									</span>
									<Dialog>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												<Eye className="mr-2 h-4 w-4" />
												View
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-2xl">
											<DialogHeader>
												<DialogTitle>Verification Document</DialogTitle>
											</DialogHeader>
											<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
												<Image
													src={farmer.verificationDocument}
													alt="Verification document"
													fill
													className="object-cover"
												/>
											</div>
										</DialogContent>
									</Dialog>
								</div>
								<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
									<Image
										src={farmer.verificationDocument}
										alt="Verification document thumbnail"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex items-center justify-between border-t pt-4">
				<div className="text-sm text-muted-foreground">
					Showing {farmers.length} pending applications
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" disabled>
						Previous
					</Button>
					<Button variant="outline" size="sm" disabled>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
