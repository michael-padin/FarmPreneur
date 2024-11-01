"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useTransition } from "react"
import { Loader2, X } from "lucide-react"
import { createProductSchema, createProductType } from "../types"
import { createProductAction } from "../actions"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AddressLocationPicker, {
	AddressInput
} from "@/components/fg/fg-map-box-location-picker"

export default function CreateProductForm() {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const [images, setImages] = useState<string[]>([])

	const form = useForm<createProductType>({
		resolver: zodResolver(createProductSchema),
		defaultValues: {
			title: "",
			description: "",
			category: "",
			price: 0,
			location: {
				country: "",
				fullAddress: "",
				latitude: 0,
				longitude: 0,
				postalCode: "",
				region: "",
				street: ""
			},
			images: [],
			quantity: 0
		}
	})

	function onSubmit(data: createProductType) {
		startTransition(() => {
			createProductAction(data).then((res) => {
				if (res?.success) {
					toast.success(res?.success)
					router.push("/dashboard/products")
				} else {
					toast.error(res?.error)
				}

				console.log(res)
			})
		})
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files) {
			const newImages = Array.from(files).map((file) =>
				URL.createObjectURL(file)
			)
			setImages((prev) => [...prev, ...newImages])
		}
	}

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index))
	}

	return (
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader>
				<CardTitle className="text-2xl">Add New Product</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Product title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="Product description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input type="number" placeholder="0" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="quantity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quantity</FormLabel>
										<FormControl>
											<Input type="number" placeholder="0" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<FormControl>
											<Input placeholder="Vegetables" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pickup Location</FormLabel>
										<FormControl>
											<AddressLocationPicker
												onAddressSelect={(address) => {
													field.onChange(address)
												}}
												defaultCenter={{
													lng: field.value.longitude,
													lat: field.value.latitude
												}}
												defaultValue={field.value.fullAddress}
												showMap
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormItem>
							<FormLabel>Images</FormLabel>
							<FormControl>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
									{images.map((image, index) => (
										<div key={index} className="relative">
											<img
												src={image}
												alt={`Product ${index + 1}`}
												className="h-32 w-full rounded-md object-cover"
											/>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												className="absolute right-1 top-1 h-6 w-6"
												onClick={() => removeImage(index)}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									))}
									<label className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400">
										<Input
											type="file"
											multiple
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
										<span className="text-sm text-gray-600">Add Images</span>
									</label>
								</div>
							</FormControl>
							<FormDescription>
								Upload one or more product images.
							</FormDescription>
						</FormItem>
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? <Loader2 className="animate-spin" /> : "Submit"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
