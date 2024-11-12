"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"
import { usePendingFarmerCount } from "@/contexts/pending-farmer-count-context"
import { Card, CardContent } from "@/components/ui/card"
import { SidebarMenuBadge } from "@/components/ui/sidebar"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UsersNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UsersNav({ className, ...props }: UsersNavProps) {
	const { pendingFarmerCount } = usePendingFarmerCount()
	const pathname = usePathname()

	const navItems = [
		{
			name: "All users",
			href: "/dashboard/users"
		},
		{
			name: "Customers",
			href: "/dashboard/users/customers"
		},
		{
			name: "Farmers",
			href: "/dashboard/users/farmers"
		},
		{
			name: "Pending Farmers",
			href: "/dashboard/users/pending-farmers",
			badge: pendingFarmerCount
		}
	]

	return (
		<Card>
			<ScrollArea className="max-w-[600px] lg:max-w-none">
				<CardContent className="flex p-4 lg:p-6">
					{navItems.map((item, index) => (
						<div className="" key={item.href}>
							<Link
								href={item.href}
								className={cn(
									"relative flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-center text-sm transition-colors hover:text-primary",
									pathname === item.href || (index === 0 && pathname === "/")
										? "bg-muted font-medium text-primary"
										: "text-muted-foreground"
								)}
							>
								{item.name}
								{item.badge !== 0 && item.badge && (
									<SidebarMenuBadge className="-right-1 -top-1 bg-primary text-primary-foreground">
										{item.badge}
									</SidebarMenuBadge>
								)}
							</Link>
						</div>
					))}
					<ScrollBar orientation="horizontal" className="invisible" />
				</CardContent>
			</ScrollArea>
		</Card>
	)
}
