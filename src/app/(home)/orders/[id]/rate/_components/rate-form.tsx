"use client"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { rateOrder } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { formatPHP } from "@/lib/utils"
import { getCustomerOrderItemsUseCase } from "@/use-cases/orders"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { formatPhoneNumber } from "react-phone-number-input"
import { toast } from "sonner"
import { z } from "zod"

const ratingSchema = z.object({
	review: z.string().optional(),
	rate: z.number().min(1, { message: "Please select a rating" }).max(5),
	productId: z.string()
})

const ratingsSchema = z.object({
	ratings: z.array(ratingSchema)
})
export function RateForm({
	orderId,
	orderItems
}: {
	orderItems: Awaited<ReturnType<typeof getCustomerOrderItemsUseCase>>
	orderId: string
}) {
	const [hoveredRatings, setHoveredRatings] = useState<{
		[key: string]: number
	}>({})

	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<z.infer<typeof ratingsSchema>>({
		resolver: zodResolver(ratingsSchema),
		defaultValues: {
			ratings: orderItems.map((item) => ({
				productId: item.productId
			}))
		}
	})

	const renderStars = (
		productId: string,
		currentValue: number,
		setRatingFn: (value: number) => void
	) => {
		return [1, 2, 3, 4, 5].map((star) => (
			<Star
				key={star}
				size={32}
				className={`cursor-pointer stroke-1 transition-colors duration-200 ${
					star <= (hoveredRatings[productId] || currentValue)
						? "fill-yellow-400 text-yellow-400"
						: "text-muted-foreground"
				}`}
				onMouseEnter={() =>
					setHoveredRatings((prev) => ({
						...prev,
						[productId]: star
					}))
				}
				onMouseLeave={() =>
					setHoveredRatings((prev) => ({
						...prev,
						[productId]: 0
					}))
				}
				onClick={() => setRatingFn(star)}
			/>
		))
	}
	const onSubmit = (data: z.infer<typeof ratingsSchema>) => {
		startTransition(async () => {
			const { error } = await rateOrder({
				orderId,
				ratings: data.ratings
			})
			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Rating submitted successfully")
			router.back()
		})
	}

	return (
		<div>
			<Form {...form}>
				<div className="relative w-full">
					<Card className="relative mb-2 w-full border-none bg-background">
						<CardHeader className="p-3">
							<CardTitle className="text-primary">
								{orderItems[0].farmerName}
							</CardTitle>
							<CardDescription>
								<a
									href={`tel:${formatPhoneNumber(orderItems[0].farmerContact)}`}
								>
									{formatPhoneNumber(orderItems[0].farmerContact)}
								</a>
							</CardDescription>
						</CardHeader>
					</Card>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<fieldset className="space-y-2" disabled={isPending}>
							{orderItems.map((item, index) => (
								<div
									key={item.productId}
									className="space-y-4 rounded-lg bg-background p-2"
								>
									<div key={item.productId} className="flex gap-4">
										<div className="relative h-24 w-24 overflow-hidden rounded-lg border">
											<Image
												src={item.image}
												alt={item.name}
												fill
												className="object-cover"
												priority
												sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
											/>
										</div>
										<div className="flex flex-1 flex-col gap-1">
											<div className="flex items-center justify-between">
												<h3 className="">{item.name}</h3>
											</div>
											<div className="mt-auto flex items-center justify-between">
												<div className="flex items-center gap-2">
													<p className="text-primary">
														₱{formatPHP(item.price)}/
														<span className="">{item.unit}</span>
													</p>
												</div>
												<div className="">
													<span className="">x{item.quantity}</span>
												</div>
											</div>
										</div>
									</div>
									<FormField
										control={form.control}
										name={`ratings.${index}.productId`}
										render={({ field }) => (
											<FormItem className="hidden">
												<FormLabel className="sr-only">Product ID</FormLabel>
												<Input {...field} />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`ratings.${index}.rate`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Your Rating</FormLabel>
												<FormControl>
													<div className="my-2 flex items-center space-x-2">
														{renderStars(
															item.productId,
															field.value,
															(rating) => {
																field.onChange(rating)
															}
														)}
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
										name={`ratings.${index}.review`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Your Review</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Fresh produce and kind farmer!"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							))}

							<div className="fixed bottom-0 left-0 right-0 flex bg-background p-4">
								<Button
									className="w-full"
									disabled={isPending}
									variant={"default"}
								>
									{isPending ? "Submitting..." : "Submit Review"}
								</Button>
							</div>
						</fieldset>
					</form>
				</div>
			</Form>
		</div>
	)
}
