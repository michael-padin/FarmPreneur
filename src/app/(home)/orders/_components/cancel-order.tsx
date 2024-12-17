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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cancelOrder } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { zodResolver } from "@hookform/resolvers/zod"
import { OrderStatus } from "@prisma/client"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const cancelOrderSchema = z.object({
	reason: z.string().min(1, "Reason is required")
})

export function CancelOrder({
	orderId,
	status
}: {
	orderId: string
	status: OrderStatus
}) {
	const [isPending, startTransition] = useTransition()
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof cancelOrderSchema>>({
		resolver: zodResolver(cancelOrderSchema),
		defaultValues: {
			reason: ""
		}
	})

	const onSubmit = (data: z.infer<typeof cancelOrderSchema>) => {
		startTransition(async () => {
			const { error } = await cancelOrder({
				orderId,
				cancellationReason: data.reason,
				subStatus: "CANCELLED_BY_BUYER"
			})
			if (error) {
				showErrorToast(error)
				return
			}
		})
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant={"outline"}>Cancel</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle className="sr-only"></DrawerTitle>
					<DrawerDescription className="sr-only"></DrawerDescription>
				</DrawerHeader>

				<Form {...form}>
					<div className="w-full px-4">
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<fieldset className="space-y-4" disabled={isPending}>
								<FormField
									control={form.control}
									name="reason"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cancellation Reason</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Your cancellation reason"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									className="w-full"
									disabled={isPending}
									variant={"outline"}
								>
									{status === "PENDING" ? "Submitting..." : "Submit"}
								</Button>
							</fieldset>
						</form>
					</div>
				</Form>
				<DrawerFooter className="pt-1">
					<DrawerClose asChild>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
