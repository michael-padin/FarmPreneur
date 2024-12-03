"use client"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { use, useTransition } from "react"
import { showErrorToast } from "@/lib/handle-error"
import { toast } from "sonner"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FPUnitSelect } from "@/components/fg/fp-select-unit"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"
import { S3PATH } from "@/constants/s3-path"
import { useRouter } from "next/navigation"
import { createProductSchema, CreateProductSchema } from "../validations"
import { createProduct } from "../actions"
import { getFarmerAddressesUseCase } from "@/use-cases/address"
import { Address } from "@prisma/client"
import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import Link from "next/link"

function CustomTrigger({ address }: { address: Address }) {
	return (
		<div className="flex items-center space-x-2">
			{/* <MapPin className="h-4 w-4 text-muted-foreground" /> */}
			<div className="flex-1 text-left">
				{address ? (
					<div className="flex flex-col">
						<span className="truncate font-medium">{address.fullAddress}</span>
						{address.label && (
							<span className="text-xs text-muted-foreground">
								{address.label}
							</span>
						)}
					</div>
				) : (
					<span className="text-muted-foreground">Select an address</span>
				)}
			</div>
		</div>
	)
}
const defaultValues: CreateProductSchema = {
	title: "",
	description: "",
	price: 0,
	unit: "",
	quantity: 0,
	categoryId: "",
	images: [],
	pickupLocationId: ""
}
interface CreateProductFormProps {
	categoriesPromise: Awaited<ReturnType<typeof getCategoriesUseCase>>
	addressesPromise: Awaited<ReturnType<typeof getFarmerAddressesUseCase>>
}
export function CreateProductForm({
	categoriesPromise,
	addressesPromise
}: CreateProductFormProps) {
	const router = useRouter()

	const [isUpdatePending, startUpdateTransition] = useTransition()
	const form = useForm<CreateProductSchema>({
		resolver: zodResolver(createProductSchema),
		defaultValues
	})

	const pickupLocationId = form.watch("pickupLocationId")
	const foundAddress = addressesPromise?.find(
		(address) => address.id === pickupLocationId
	)

	const onSubmit = async (data: CreateProductSchema) => {
		startUpdateTransition(async () => {
			const { error } = await createProduct(data)
			if (error) {
				showErrorToast(error)
				return
			}
			toast.success("Product created successfully!")
			router.push("/dashboard/farmer/products")
		})
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="space-y-4" disabled={isUpdatePending}>
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
									The name of your product as it will appear in the marketplace.
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
									<Textarea placeholder="Describe your product..." {...field} />
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
					<FormField
						control={form.control}
						name="pickupLocationId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pickup Location</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select an address">
												<CustomTrigger address={foundAddress!} />
											</SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{addressesPromise && addressesPromise?.length > 0 ? (
											addressesPromise.map((address) => (
												<SelectItem key={address.id} value={address.id}>
													<div className="flex flex-col">
														<span className="truncate">
															{address.fullAddress}
														</span>
														{address.label && (
															<span className="text-xs text-muted-foreground">
																Label: {address.label}
															</span>
														)}
													</div>
												</SelectItem>
											))
										) : (
											<SelectItem disabled value="#">
												No Address
											</SelectItem>
										)}
									</SelectContent>
								</Select>
								{pickupLocationId && (
									<AddressDetailsDrawerDialog
										address={foundAddress!}
										name="Pickup"
									/>
								)}
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
										{categoriesPromise.length > 0 ? (
											categoriesPromise.map((category) => (
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

					<div className="space-y-2">
						<Button type="submit" className="w-full">
							Add Product
						</Button>
						<Button
							type="button"
							className="w-full"
							variant={"outline"}
							asChild
						>
							<Link href={"/dashboard/farmer/products"}>Cancel</Link>
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
