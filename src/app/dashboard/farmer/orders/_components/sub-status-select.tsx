"use client"

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { updateOrderSubStatus } from "@/lib/actions"
import { OrderSubStatus } from "@prisma/client"
import { useTransition } from "react"

export function SubStatusSelect({
	orderId,
	triggerClassName,
	currentSubStatus
}: {
	triggerClassName?: string
	orderId: string
	currentSubStatus: OrderSubStatus
}) {
	const [isPending, startTransition] = useTransition()

	const handleValueChange = (value: string) => {
		startTransition(async () => {
			await updateOrderSubStatus({
				orderId,
				status: value as OrderSubStatus
			})
		})
	}

	return (
		<div>
			<Select
				onValueChange={handleValueChange}
				disabled={isPending}
				defaultValue={
					currentSubStatus === "ORDER_ACCEPTED" ? undefined : currentSubStatus
				}
			>
				<SelectTrigger className={triggerClassName}>
					<SelectValue placeholder="Select a status" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{/* <SelectLabel>Active/In Progress</SelectLabel> */}
						<SelectItem value="PREPARING_PRODUCE">Preparing Produce</SelectItem>
						<SelectItem value="PRODUCE_READY_FOR_PICKUP">
							Ready for Pickup
						</SelectItem>
					</SelectGroup>
					<SelectGroup>
						{/* <SelectLabel>Completed</SelectLabel> */}
						<SelectItem value="PICKED_UP_BY_BUYER">Picked Up</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			{/* {isPending && <p>Updating status...</p>}
			{state && <p>{state.message}</p>} */}
		</div>
	)
}
