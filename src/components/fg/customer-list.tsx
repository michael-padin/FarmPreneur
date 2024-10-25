import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	ChevronDown,
	ChevronUp,
	Mail,
	Phone,
	MapPin,
	ShoppingCart,
	DollarSign,
	Search,
	Calendar,
	UserCheck,
	UserX
} from "lucide-react"

type Customer = {
	id: string
	name: string
	email: string
	contact: string
	orders: number
	totalSpend: string
	address: string
	createdAt: string
	updatedAt: string
	lastOrderDate: string
	status: "Active" | "Inactive"
	verification: "Verified" | "Unverified"
	avatarUrl: string
}

const customers: Customer[] = [
	{
		id: "1",
		name: "Rey Ihef",
		email: "reyihef667@angewy.com",
		contact: "+639123456789",
		orders: 0,
		totalSpend: "₱0",
		address: "6019, Sibonga, Cebu, Philippines",
		createdAt: "October 22, 2024",
		updatedAt: "October 24, 2024",
		lastOrderDate: "N/A",
		status: "Inactive",
		verification: "Verified",
		avatarUrl: "https://i.pravatar.cc/150?img=68"
	},
	{
		id: "2",
		name: "Sophia Chen",
		email: "sophia.chen@example.com",
		contact: "+1234567890",
		orders: 15,
		totalSpend: "$1,250",
		address: "789 Oak St, San Francisco, CA 94122, USA",
		createdAt: "September 15, 2024",
		updatedAt: "October 25, 2024",
		lastOrderDate: "October 20, 2024",
		status: "Active",
		verification: "Verified",
		avatarUrl: "https://i.pravatar.cc/150?img=47"
	},
	{
		id: "3",
		name: "Liam O'Connor",
		email: "liam.oconnor@example.com",
		contact: "+353891234567",
		orders: 7,
		totalSpend: "€680",
		address: "42 Grafton Street, Dublin 2, Ireland",
		createdAt: "August 3, 2024",
		updatedAt: "October 18, 2024",
		lastOrderDate: "October 15, 2024",
		status: "Active",
		verification: "Unverified",
		avatarUrl: "https://i.pravatar.cc/150?img=11"
	},
	{
		id: "4",
		name: "Aisha Patel",
		email: "aisha.patel@example.com",
		contact: "+919876543210",
		orders: 22,
		totalSpend: "₹15,000",
		address: "303, Lodha Supremus, Worli, Mumbai 400018, India",
		createdAt: "July 12, 2024",
		updatedAt: "October 23, 2024",
		lastOrderDate: "October 22, 2024",
		status: "Active",
		verification: "Verified",
		avatarUrl: "https://i.pravatar.cc/150?img=23"
	},
	{
		id: "5",
		name: "Juan Carlos Rodríguez",
		email: "juancarlos@example.com",
		contact: "+34612345678",
		orders: 5,
		totalSpend: "€450",
		address: "Calle Mayor 28, 28013 Madrid, Spain",
		createdAt: "October 1, 2024",
		updatedAt: "October 26, 2024",
		lastOrderDate: "October 24, 2024",
		status: "Active",
		verification: "Verified",
		avatarUrl: "https://i.pravatar.cc/150?img=59"
	},
	{
		id: "6",
		name: "Emma Watson",
		email: "emma.watson@example.com",
		contact: "+447700900123",
		orders: 3,
		totalSpend: "£320",
		address: "15 Regent Street, London SW1Y 4LR, UK",
		createdAt: "October 10, 2024",
		updatedAt: "October 25, 2024",
		lastOrderDate: "October 23, 2024",
		status: "Active",
		verification: "Unverified",
		avatarUrl: "https://i.pravatar.cc/150?img=9"
	},
	{
		id: "7",
		name: "Hiroshi Tanaka",
		email: "hiroshi.tanaka@example.com",
		contact: "+81345678901",
		orders: 18,
		totalSpend: "¥25,000",
		address: "1-1-2 Omotesando, Shibuya-ku, Tokyo 150-0001, Japan",
		createdAt: "June 5, 2024",
		updatedAt: "October 22, 2024",
		lastOrderDate: "October 21, 2024",
		status: "Active",
		verification: "Verified",
		avatarUrl: "https://i.pravatar.cc/150?img=70"
	},
	{
		id: "8",
		name: "Maria Silva",
		email: "maria.silva@example.com",
		contact: "+5511987654321",
		orders: 9,
		totalSpend: "R$750",
		address:
			"Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100, Brazil",
		createdAt: "September 1, 2024",
		updatedAt: "October 24, 2024",
		lastOrderDate: "October 19, 2024",
		status: "Inactive",
		verification: "Verified",
		avatarUrl: "https://i.pravatar.cc/150?img=32"
	},
	{
		id: "9",
		name: "Ahmed Al-Mansoori",
		email: "ahmed.almansoori@example.com",
		contact: "+971501234567",
		orders: 12,
		totalSpend: "AED 2,800",
		address: "Sheikh Mohammed Bin Rashed Boulevard, Dubai, UAE",
		createdAt: "August 20, 2024",
		updatedAt: "October 23, 2024",
		lastOrderDate: "October 18, 2024",
		status: "Active",
		verification: "Verified",
		avatarUrl: "https://i.pravatar.cc/150?img=53"
	},
	{
		id: "10",
		name: "Olivia Brown",
		email: "olivia.brown@example.com",
		contact: "+61412345678",
		orders: 6,
		totalSpend: "A$580",
		address: "200 George St, Sydney NSW 2000, Australia",
		createdAt: "October 5, 2024",
		updatedAt: "October 26, 2024",
		lastOrderDate: "October 25, 2024",
		status: "Active",
		verification: "Unverified",
		avatarUrl: "https://i.pravatar.cc/150?img=41"
	}
]

function CustomerCard({ customer }: { customer: Customer }) {
	const [expanded, setExpanded] = useState(false)

	return (
		<Card className="mb-4 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md">
			<CardContent className="p-0">
				<div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 p-4">
					<div className="flex items-center space-x-4">
						<Avatar className="h-12 w-12 border-2 border-primary/20">
							<AvatarImage src={customer.avatarUrl} alt={customer.name} />
							<AvatarFallback>
								{customer.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="text-lg font-semibold">{customer.name}</h3>
							<p className="text-sm text-muted-foreground">{customer.email}</p>
						</div>
					</div>
					<Badge
						variant={customer.status === "Active" ? "default" : "secondary"}
						className="text-xs"
					>
						{customer.status}
					</Badge>
				</div>
				<div className="flex items-center justify-between bg-background/50 px-4 py-2 text-sm">
					<div className="flex items-center space-x-2">
						<ShoppingCart className="h-4 w-4 text-primary" />
						<span>{customer.orders} orders</span>
					</div>
					<div className="flex items-center space-x-2">
						<DollarSign className="h-4 w-4 text-primary" />
						<span>{customer.totalSpend} total spend</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="p-1"
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</Button>
				</div>
				{expanded && (
					<div className="space-y-3 bg-background/30 p-4 text-sm">
						<div className="flex items-center space-x-2">
							<Phone className="h-4 w-4 text-primary" />
							<span>{customer.contact}</span>
						</div>
						<div className="flex items-center space-x-2">
							<MapPin className="h-4 w-4 text-primary" />
							<span className="truncate">{customer.address}</span>
						</div>
						<div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
							<div className="flex items-center space-x-1">
								<Calendar className="h-3 w-3" />
								<span>Created: {customer.createdAt}</span>
							</div>
							<div className="flex items-center space-x-1">
								<Calendar className="h-3 w-3" />
								<span>Updated: {customer.updatedAt}</span>
							</div>
							<div className="flex items-center space-x-1">
								<Calendar className="h-3 w-3" />
								<span>Last Order: {customer.lastOrderDate}</span>
							</div>
							<div className="flex items-center space-x-1">
								{customer.verification === "Verified" ? (
									<UserCheck className="h-3 w-3 text-green-500" />
								) : (
									<UserX className="h-3 w-3 text-red-500" />
								)}
								<span>{customer.verification}</span>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default function PolishedCustomerList() {
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("All")
	const [verificationFilter, setVerificationFilter] = useState("All")

	const filteredCustomers = useMemo(() => {
		return customers.filter(
			(customer) =>
				(customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					customer.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
				(statusFilter === "All" || customer.status === statusFilter) &&
				(verificationFilter === "All" ||
					customer.verification === verificationFilter)
		)
	}, [searchTerm, statusFilter, verificationFilter])

	return (
		<div className="mx-auto w-full max-w-3xl space-y-4 p-4">
			<h2 className="mb-6 text-center text-2xl font-bold">
				Customer Management
			</h2>
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="relative flex-grow">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search customers..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">All Statuses</SelectItem>
						<SelectItem value="Active">Active</SelectItem>
						<SelectItem value="Inactive">Inactive</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={verificationFilter}
					onValueChange={setVerificationFilter}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by verification" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">All Verifications</SelectItem>
						<SelectItem value="Verified">Verified</SelectItem>
						<SelectItem value="Unverified">Unverified</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<ScrollArea className="h-[600px] w-full rounded-md border">
				<div className="space-y-4 p-4">
					{filteredCustomers.map((customer) => (
						<CustomerCard key={customer.id} customer={customer} />
					))}
				</div>
			</ScrollArea>
			<div className="text-center text-sm text-muted-foreground">
				Showing {filteredCustomers.length} of {customers.length} customers
			</div>
		</div>
	)
}
