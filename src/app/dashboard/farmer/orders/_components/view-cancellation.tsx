"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import { orderSubStatusMap } from "@/constants/order"
import { useMediaQuery } from "@/hooks/use-media-query"
import { OrderSubStatus } from "@prisma/client"
import { useState } from "react"

export function ViewCancellation({
	reason,
	triggerClassName,
	subStatus
}: {
	reason: string
	triggerClassName?: string
	subStatus: OrderSubStatus
}) {
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const [open, setOpen] = useState(false)

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant={"outline"} className={triggerClassName}>
						View Cancellation Reason
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-screen-sm">
					<DialogHeader>
						<DialogTitle className="text-destructive">
							{orderSubStatusMap[subStatus].label}
						</DialogTitle>
						<DialogDescription className="sr-only"></DialogDescription>
					</DialogHeader>
					<div className="w-full px-4">
						<Textarea
							placeholder="Your cancellation reason"
							disabled
							value={reason}
						/>
					</div>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant={"outline"} className={triggerClassName}>
					View Cancellation Reason
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle className="text-destructive">
						{orderSubStatusMap[subStatus].label}
					</DrawerTitle>
					<DrawerDescription className="sr-only"></DrawerDescription>
				</DrawerHeader>

				<div className="w-full px-4">
					<Textarea
						placeholder="Your cancellation reason"
						disabled
						value={reason}
					/>
				</div>
				<DrawerFooter className="pt-1">
					<DrawerClose asChild>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
