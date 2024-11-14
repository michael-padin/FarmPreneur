"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import { use, useState, useTransition } from "react"
import { AddProductSchema, addProductSchema } from "../validations"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FPUnitSelect } from "@/components/fg/fp-select-unit"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"
import { S3PATH } from "@/constants/s3-path"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { getApprovedFarmersUseCase } from "@/use-cases/farmers"
import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { PRODUCT_STATUS } from "@/constants/product-status"
import { ProductListingStatusBadge } from "../../../users/(lists)/_components/badges"
import { ProductListingStatus } from "@prisma/client"
import { createProductFromAdmin } from "../actions"
import { showErrorToast } from "@/lib/handle-error"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Plus } from "lucide-react"

const defaultValues: AddProductSchema = {
	title: "",
	description: "",
	price: 0,
	unit: "",
	quantity: 0,
	categoryId: "",
	farmerId: "",
	listingStatus: "PENDING",
	images: [],
	pickupLocation: {
		fullAddress: "",
		street: "",
		region: "",
		country: "",
		postalCode: "",
		latitude: 0,
		longitude: 0
	}
}

interface AddProductSheetProps {
	categoriesPromise: Promise<Awaited<ReturnType<typeof getCategoriesUseCase>>>
	approvedFarmersPromise: Promise<
		Awaited<ReturnType<typeof getApprovedFarmersUseCase>>
	>
}
export function AddProductSheet({
	approvedFarmersPromise,
	categoriesPromise
}: AddProductSheetProps) {
	const farmers = use(approvedFarmersPromise)
	const categories = use(categoriesPromise)
	const [sheetOpen, setSheetOpen] = useState(false)
	const [isUpdatePending, startUpdateTransition] = useTransition()
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const form = useForm<AddProductSchema>({
		resolver: zodResolver(addProductSchema),
		defaultValues
	})

	const onSubmit = async (data: AddProductSchema) => {
		startUpdateTransition(async () => {
			const { error } = await createProductFromAdmin(data)
			if (error) {
				showErrorToast(error)
				return
			}
			toast.success("Product created successfully!")
			form.reset(defaultValues)
			setSheetOpen(false)
		})
	}

	return (
		<Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
			<SheetTrigger asChild>
				{isDesktop ? (
					<Button>Add Product</Button>
				) : (
					<Button size={"icon"}>
						<Plus />
					</Button>
				)}
			</SheetTrigger>
			<Form {...form}>
				<SheetContent className="w-full space-y-4 overflow-y-scroll lg:min-w-[540px]">
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<fieldset className="space-y-4" disabled={isUpdatePending}>
							<SheetHeader className="text-left">
								<SheetTitle>Add New Product</SheetTitle>
								<SheetDescription>
									Enter the details of your product to list it in the
									farmer&apos;s marketplace.
								</SheetDescription>
							</SheetHeader>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="e.g. Tomatoes" {...field} />
										</FormControl>
										<FormDescription>
											The name of your product as it will appear in the
											marketplace.
										</FormDescription>

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
											<Textarea
												placeholder="Describe your product..."
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Provide a detailed description of your product.
										</FormDescription>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="pickupLocation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pickup Location</FormLabel>
										<FormControl>
											<AddressLocationPicker
												onAddressSelect={(address) => {
													field.onChange(address)
												}}
												defaultCenter={{
													lng: field.value?.longitude || 0,
													lat: field.value?.latitude || 0
												}}
												defaultValue={field.value?.fullAddress}
												showMap
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-2">
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="Enter price"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="unit"
									render={({ field }) => (
										<FormItem>
											<FPUnitSelect {...field} />
											<FormDescription>Available quantity.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="quantity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quantity</FormLabel>
										<FormControl>
											<Input type="number" placeholder="1" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.length > 0 ? (
													categories.map((category) => (
														<SelectItem key={category.id} value={category.id}>
															{category.name}
														</SelectItem>
													))
												) : (
													<SelectItem disabled value="#">
														No items
													</SelectItem>
												)}
											</SelectContent>
										</Select>
										<FormDescription>
											Choose the category that best fits your product.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="farmerId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Assign to</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a farmer" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{farmers.length > 0 ? (
													farmers.map((farmer) => (
														<SelectItem key={farmer.id} value={farmer.id}>
															{farmer.user.name}
														</SelectItem>
													))
												) : (
													<SelectItem disabled value="#">
														No items
													</SelectItem>
												)}
											</SelectContent>
										</Select>
										<FormDescription>
											Assign this product to a farmer in the marketplace.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="listingStatus"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Listing Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.entries(PRODUCT_STATUS).map(([key, value]) => (
													<SelectItem key={key} value={key}>
														<div className="flex items-center gap-2">
															<ProductListingStatusBadge
																status={key as ProductListingStatus}
																className="h-5 w-5 rounded-full"
															/>
															<span> {value}</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription>
											Set the current status of this product listing.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="images"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Product Image</FormLabel>
										<FormControl>
											<FileUpload
												onChange={field.onChange}
												value={field.value && field.value}
												path={S3PATH.PRODUCTIMAGES}
												multiple
												maxFiles={5}
											/>
										</FormControl>
										<FormDescription>
											Upload an image of the product
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<SheetFooter>
								<SheetClose asChild>
									<Button
										variant={"outline"}
										type="button"
										className="max-sm:my-2"
									>
										Cancel
									</Button>
								</SheetClose>
								<Button type="submit">Add Product</Button>
							</SheetFooter>
						</fieldset>
					</form>
				</SheetContent>
			</Form>
		</Sheet>
	)
}
