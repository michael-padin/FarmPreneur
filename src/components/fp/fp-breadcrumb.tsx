import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { useMediaQuery } from "@/hooks/use-media-query"
import Link from "next/link"
import { Fragment, useState } from "react"
import { Button } from "../ui/button"

const ITEMS_TO_DISPLAY = 3

export interface BreadcrumbResponsiveProps {
	items: {
		href?: string
		label: string
	}[]
	itemsToDisplay?: number
}

export function FPBreadcrumbResponsive({
	items,
	itemsToDisplay = ITEMS_TO_DISPLAY
}: BreadcrumbResponsiveProps) {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href={items[0].href || "#"}>{items[0].label}</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{items.length > itemsToDisplay && (
					<>
						<BreadcrumbItem>
							{isDesktop ? (
								<DropdownMenu open={open} onOpenChange={setOpen}>
									<DropdownMenuTrigger
										className="flex items-center gap-1"
										aria-label="Toggle menu"
									>
										<BreadcrumbEllipsis className="h-4 w-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										{items.slice(1, -2).map((item, index) => (
											<DropdownMenuItem key={index}>
												<Link href={item.href ? item.href : "#"}>
													{item.label}
												</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Drawer open={open} onOpenChange={setOpen}>
									<DrawerTrigger aria-label="Toggle Menu">
										<BreadcrumbEllipsis className="h-4 w-4" />
									</DrawerTrigger>
									<DrawerContent>
										<DrawerHeader className="text-left">
											<DrawerTitle>Navigate to</DrawerTitle>
											<DrawerDescription>
												Select a page to navigate to.
											</DrawerDescription>
										</DrawerHeader>
										<div className="grid gap-1 px-4">
											{items.slice(1, -2).map((item, index) => (
												<Link
													key={index}
													href={item.href ? item.href : "#"}
													className="py-1 text-sm"
												>
													{item.label}
												</Link>
											))}
										</div>
										<DrawerFooter className="pt-4">
											<DrawerClose asChild>
												<Button variant="outline">Close</Button>
											</DrawerClose>
										</DrawerFooter>
									</DrawerContent>
								</Drawer>
							)}
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}
				{items.slice(-itemsToDisplay + 1).map((item, index) => (
					<Fragment key={index}>
						{item.href ? (
							<>
								<BreadcrumbItem>
									<BreadcrumbLink
										asChild
										className="max-w-20 truncate md:max-w-none"
									>
										<Link href={item.href}>{item.label}</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
							</>
						) : (
							<BreadcrumbItem>
								<BreadcrumbPage className="max-w-20 truncate md:max-w-none">
									{item.label}
								</BreadcrumbPage>
							</BreadcrumbItem>
						)}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
