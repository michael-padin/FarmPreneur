import {
	Search,
	Filter,
	Plus,
	Home,
	ShoppingCart,
	Package,
	Bell,
	User,
	MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function ProductDashboardMobile() {
	return (
		<div className="flex min-h-screen flex-col bg-gray-50">
			<header className="sticky top-0 z-10 border-b bg-white">
				<div className="flex items-center justify-between p-4">
					<h1 className="text-lg font-semibold">Products</h1>
					<Button size="sm" variant="ghost">
						<Plus className="h-5 w-5" />
					</Button>
				</div>
			</header>

			<main className="flex-1 overflow-auto px-4 py-2">
				<div className="mb-3 flex items-center gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Search products..." className="h-9 pl-8" />
					</div>
					<Button variant="outline" size="icon" className="h-9 w-9">
						<Filter className="h-4 w-4" />
					</Button>
				</div>

				<Tabs defaultValue="all" className="mb-3 w-full">
					<TabsList className="grid h-9 w-full grid-cols-4">
						<TabsTrigger value="all" className="text-xs">
							All
						</TabsTrigger>
						<TabsTrigger value="pending" className="text-xs">
							Pending
						</TabsTrigger>
						<TabsTrigger value="approved" className="text-xs">
							Approved
						</TabsTrigger>
						<TabsTrigger value="rejected" className="text-xs">
							Rejected
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="space-y-3">
					{[1, 2, 3].map((item) => (
						<Card key={item} className="overflow-hidden">
							<CardContent className="p-3">
								<div className="flex items-center space-x-3">
									<Image
										src="/placeholder.svg"
										alt="Product image"
										width={60}
										height={60}
										className="rounded-md object-cover"
									/>
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-start justify-between">
											<h3 className="truncate text-sm font-medium">
												Product Name
											</h3>
											<Badge
												variant="secondary"
												className="bg-green-100 text-xs text-green-700"
											>
												APPROVED
											</Badge>
										</div>
										<p className="mb-1 truncate text-xs text-muted-foreground">
											Product description here
										</p>
										<div className="flex items-center gap-2 text-xs">
											<span className="font-medium">₱4,234.00</span>
											<span className="text-muted-foreground">
												4,324 in stock
											</span>
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0"
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</main>

			<footer className="sticky bottom-0 border-t bg-background">
				<nav className="flex items-center justify-around p-1">
					{[
						{ icon: Home, label: "Home" },
						{ icon: ShoppingCart, label: "Orders" },
						{ icon: Package, label: "Products", active: true },
						{ icon: Bell, label: "Notifications" },
						{ icon: User, label: "Profile" }
					].map(({ icon: Icon, label, active }) => (
						<Button
							key={label}
							variant="ghost"
							size="sm"
							className={`flex h-auto flex-col items-center gap-1 py-1 ${
								active ? "text-primary" : "text-muted-foreground"
							}`}
						>
							<Icon className="h-5 w-5" />
							<span className="text-[10px]">{label}</span>
						</Button>
					))}
				</nav>
			</footer>
		</div>
	)
}
