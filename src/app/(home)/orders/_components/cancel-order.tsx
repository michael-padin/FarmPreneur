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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cancelOrder } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { zodResolver } from "@hookform/resolvers/zod"
import { OrderStatus, OrderSubStatus } from "@prisma/client"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const cancelOrderSchema = z.object({
	reason: z.string().min(1, "Reason is required")
})

export function CancelOrder({
	orderId,
	status,
	triggerClassName
}: {
	triggerClassName?: string
	orderId: string
	status: OrderStatus
}) {
	const isDesktop = useMediaQuery("(min-width: 768px)")
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
				subStatus: OrderSubStatus.ORDER_CANCELLED
			})
			if (error) {
				showErrorToast(error)
				return
			}
		})
	}

	const renderForm = () => {
		return (
			<Form {...form}>
				<div className="w-full px-4">
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<fieldset className="space-y-4" disabled={isPending}>
							<FormField
								control={form.control}
								name="reason"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="sr-only">
											Cancellation Reason
										</FormLabel>

										<FormControl>
											<Textarea
												placeholder="Farmer didn't respond"
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
								variant={"secondary"}
							>
								{isPending ? "Submitting..." : "Submit"}
							</Button>
						</fieldset>
					</form>
				</div>
			</Form>
		)
	}
	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant={"outline"} size={"sm"} className={triggerClassName}>
						Cancel{" "}
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-screen-sm">
					<DialogHeader>
						<DialogTitle className="">Provide Cancellation Reason</DialogTitle>
						<DialogDescription className="sr-only"></DialogDescription>
					</DialogHeader>
					{renderForm()}
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant={"outline"} className={triggerClassName}>
					Cancel
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle className="">Provide Cancellation Reason</DrawerTitle>
					<DrawerDescription className="sr-only"></DrawerDescription>
				</DrawerHeader>
				{renderForm()}
				<DrawerFooter className="pt-1">
					<DrawerClose asChild>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
