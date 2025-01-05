"use client"

import { FPMediaUploader } from "@/components/fp/fp-media-uploader"
import { Button } from "@/components/ui/button"
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
import { getCustomerUnReviewedOrderUseCase } from "@/use-cases/orders"
import { processMediaUpdate } from "@/utils/media"
import { mediaFileSchema } from "@/validations/media"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const ratingSchema = z.object({
	review: z.string().optional(),
	rate: z.number().min(1, { message: "Please select a rating" }).max(5),
	productId: z.string(),
	images: z.array(mediaFileSchema).optional()
})

const ratingsSchema = z.object({
	ratings: z.array(ratingSchema)
})
export function RateForm({
	orderId,
	userId,
	order
}: {
	order: Awaited<ReturnType<typeof getCustomerUnReviewedOrderUseCase>>
	orderId: string
	userId: string
}) {
	const [hoveredRatings, setHoveredRatings] = useState<{
		[key: string]: number
	}>({})

	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<z.infer<typeof ratingsSchema>>({
		resolver: zodResolver(ratingsSchema),
		defaultValues: {
			ratings: order.items.map((item) => ({
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
			const newRatings = await Promise.all(
				data.ratings.map(async (rating) => {
					const finalReviewImages = await processMediaUpdate({
						currentFiles: [],
						newFiles: rating.images ?? [],
						userId: userId,
						path: "review-images"
					})

					return {
						...rating,
						images:
							finalReviewImages.length > 0
								? finalReviewImages.map((file) => file.url)
								: []
					}
				})
			)

			const { error } = await rateOrder({
				orderId,
				ratings: newRatings
			})
			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Rating submitted successfully", {
				position: "top-right"
			})
			router.back()
		})
	}

	return (
		<div>
			<Form {...form}>
				<div className="relative w-full">
					{/* <Card>
						<CardContent className="p-2">
							<div className="rounded-lg text-muted-foreground">
								<div className="flex justify-between">
									<div className="flex items-center gap-2">
										<Image
											src={order.farmer.profilePicture || "/placeholder.svg"}
											alt={`${order.farmer.farmName}'s Profile picture`}
											width={30}
											height={30}
											className="rounded-full"
										/>
										<h2 className="font-semibold text-foreground">
											{order.farmer.farmName}
										</h2>
										<ChevronRight className="h-4 w-4" />
									</div>
								</div>
								<div className="my-2 space-y-2 text-sm">
									{order.farmer.contactNumber && (
										<div className="flex items-center gap-2">
											<PhoneCall className="h-4 w-4" />
											<FPContactNumberDisplay
												contactNumber={order.farmer.contactNumber}
											/>
										</div>
									)}
									<div className="flex items-center gap-2">
										<MapPin className="h-5 w-5" />
										<div>
											<span className="">
												{order.farmer.address?.fullAddress}
											</span>

											<AddressDetailsDrawerDialog
												address={{
													fullAddress: order.farmer.address?.fullAddress || "",
													longitude: order.farmer.address?.longitude || 0,
													latitude: order.farmer.address?.latitude || 0
												}}
												title={`${order.farmer.farmName}'s Location`}
											/>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card> */}
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<fieldset className="space-y-2" disabled={isPending}>
							{order.items.map((item, index) => (
								<div
									key={item.productId}
									className="space-y-4 rounded-lg bg-background p-2"
								>
									<div key={item.productId} className="flex gap-4">
										<div className="relative h-16 w-16 overflow-hidden rounded-lg border">
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
										name={`ratings.${index}.images`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Review Image</FormLabel>
												<FormControl>
													<FPMediaUploader
														onChange={field.onChange}
														initialMedia={[]}
														maxFiles={5}
													/>
												</FormControl>
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

							<div className="fixed bottom-0 left-0 right-0 flex bg-background p-4 drop-shadow-2xl">
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
