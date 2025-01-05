"use client"

import { Button } from "@/components/ui/button"
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
	const [open, setOpen] = useState(false)

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant={"outline"} size={"sm"} className={triggerClassName}>
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
