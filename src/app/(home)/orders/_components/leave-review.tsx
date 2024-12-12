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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { leaveReview } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const cancelOrderSchema = z.object({
	review: z.string().min(1, "Reason is required"),
	rating: z.number().min(1, { message: "Please select a rating" }).max(5)
})

export function LeaveReview({ orderId }: { orderId: string }) {
	const [hoveredRating, setHoveredRating] = useState(0)

	const [isPending, startTransition] = useTransition()
	const [open, setOpen] = useState(false)
	const form = useForm<z.infer<typeof cancelOrderSchema>>({
		resolver: zodResolver(cancelOrderSchema),
		defaultValues: {
			review: "",
			rating: 0
		}
	})

	const renderStars = (
		currentValue: number,
		setRatingFn: (value: number) => void
	) => {
		return [1, 2, 3, 4, 5].map((star) => (
			<Star
				key={star}
				size={32}
				className={`cursor-pointer stroke-1 transition-colors duration-200 ${
					star <= (hoveredRating || currentValue)
						? "fill-yellow-400 text-yellow-400"
						: "text-muted-foreground"
				}`}
				onMouseEnter={() => setHoveredRating(star)}
				onMouseLeave={() => setHoveredRating(0)}
				onClick={() => setRatingFn(star)}
			/>
		))
	}

	const onSubmit = (data: z.infer<typeof cancelOrderSchema>) => {
		startTransition(async () => {
			const { error } = await leaveReview({
				orderId,
				rating: data.rating,
				review: data.review
			})
			if (error) {
				showErrorToast(error)
				return
			}

			setOpen(false)
		})
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant={"default"}>Leave Review </Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle className="">{"How's your order"}</DrawerTitle>
					<DrawerDescription className="">
						Please give your rating and review
					</DrawerDescription>
				</DrawerHeader>

				<Form {...form}>
					<div className="w-full px-4">
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<fieldset className="space-y-4" disabled={isPending}>
								<FormField
									control={form.control}
									name="rating"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Your Rating</FormLabel>
											<FormControl>
												<div
													className="my-2 flex items-center space-x-2"
													onMouseLeave={() => setHoveredRating(0)}
												>
													{renderStars(field.value, (rating) => {
														field.onChange(rating)
													})}
												</div>
											</FormControl>
											<FormDescription>
												{field.value
													? `You rated: ${field.value} stars`
													: "Please select a rating"}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="review"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Your Review</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Fresh produce and kind farmer!"
													{...field}
													autoFocus
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									className="w-full"
									disabled={isPending}
									variant={"default"}
								>
									{isPending ? "Submitting..." : "Submit Review"}
								</Button>
							</fieldset>
						</form>
					</div>
				</Form>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button onClick={() => setOpen(false)} variant={"secondary"}>
							Close
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
