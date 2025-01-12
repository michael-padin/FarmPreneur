"use client"

import { rejectFarmer } from "@/app/actions/farmer"
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
import { showErrorToast } from "@/lib/handle-error"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const cancelOrderSchema = z.object({
	reason: z.string().min(1, "Reason is required")
})

export function RejectFarmerDrawerDialog({
	farmerId,
	triggerClassName
}: {
	triggerClassName?: string
	farmerId: string
}) {
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const [open, setOpen] = useState(false)

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="destructive" size="lg">
						<X className="mr-2 h-4 w-4" /> Reject
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-screen-sm">
					<DialogHeader>
						<DialogTitle className="">Provide Cancellation Reason</DialogTitle>
						<DialogDescription className="sr-only">
							Provide a reason for rejection
						</DialogDescription>
					</DialogHeader>
					<div>
						<RejectFarmerForm farmerId={farmerId} setOpen={setOpen} />
					</div>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="destructive" size="lg">
					<X className="mr-2 h-4 w-4" /> Reject
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle className="text-center">
						Provide Cancellation Reason
					</DrawerTitle>
					<DrawerDescription className="sr-only"></DrawerDescription>
				</DrawerHeader>

				<DrawerFooter className="pt-1">
					<DrawerClose asChild>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

const RejectFarmerForm = ({
	farmerId,
	setOpen
}: {
	farmerId: string
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const [isPending, startTransition] = useTransition()
	const form = useForm<z.infer<typeof cancelOrderSchema>>({
		resolver: zodResolver(cancelOrderSchema),
		defaultValues: {
			reason: ""
		}
	})

	const onSubmit = (data: z.infer<typeof cancelOrderSchema>) => {
		startTransition(async () => {
			const { error } = await rejectFarmer({
				farmerId,
				rejectionReason: data.reason
			})
			if (error) {
				showErrorToast(error)
				return
			}
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="space-y-4" disabled={isPending}>
					<FormField
						control={form.control}
						name="reason"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="sr-only">Rejection Reason</FormLabel>
								<FormControl>
									<Textarea placeholder="Incorrect information" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex gap-2 lg:justify-end">
						<Button
							className=""
							disabled={isPending}
							variant={"secondary"}
							type="button"
							onClick={() => setOpen?.(false)}
						>
							Cancel
						</Button>
						<Button className="" disabled={isPending} variant={"destructive"}>
							{isPending ? "Rejecting..." : "Reject"}
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
