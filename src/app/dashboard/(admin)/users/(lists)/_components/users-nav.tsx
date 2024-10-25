"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
		href: "/dashboard/users/pending-farmers"
	}
]

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UsersNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UsersNav({ className, ...props }: UsersNavProps) {
	const pathname = usePathname()

	return (
		<div className="relative px-2 py-0 lg:p-0">
			<ScrollArea className="max-w-[600px] lg:max-w-none">
				<div
					className={cn("mb-4 flex w-max items-center", className)}
					{...props}
				>
					{navItems.map((example, index) => (
						<Link
							href={example.href}
							key={example.href}
							className={cn(
								"flex h-10 items-center justify-center rounded-lg px-4 py-2 text-center text-sm transition-colors hover:text-primary",
								pathname === example.href || (index === 0 && pathname === "/")
									? "bg-muted font-medium text-primary"
									: "text-muted-foreground"
							)}
						>
							{example.name}
						</Link>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="invisible" />
			</ScrollArea>
		</div>
	)
}
