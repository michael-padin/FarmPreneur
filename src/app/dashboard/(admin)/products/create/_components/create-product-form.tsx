"use client"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"
import { FPSelect } from "@/components/fp/fp-select"
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PRODUCT_STATUS } from "@/constants/product-status"
import { S3PATH } from "@/constants/s3-path"
import { units } from "@/constants/unit"
import { showErrorToast } from "@/lib/handle-error"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { getApprovedFarmersUseCase } from "@/use-cases/farmers"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductListingStatus } from "@prisma/client"
import { useRouter } from "next/navigation"
import { use, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ProductListingStatusBadge } from "../../../users/(lists)/_components/badges"
import { createProductFromAdmin } from "../actions"
import { createProductSchema, CreateProductSchema } from "../validations"

const defaultValues: CreateProductSchema = {
	title: "",
	description: "",
	price: 0,
	unit: "",
	quantity: 0,
	categoryId: "",
	farmerId: "",
	listingStatus: "PENDING",
	images: []
}
interface CreateProductFormProps {
	categoriesPromise: Promise<Awaited<ReturnType<typeof getCategoriesUseCase>>>
	approvedFarmersPromise: Promise<
		Awaited<ReturnType<typeof getApprovedFarmersUseCase>>
	>
}
export function CreateProductForm({
	approvedFarmersPromise,
	categoriesPromise
}: CreateProductFormProps) {
	const router = useRouter()
	const farmers = use(approvedFarmersPromise)
	const categories = use(categoriesPromise)
	const [isUpdatePending, startUpdateTransition] = useTransition()
	const form = useForm<CreateProductSchema>({
		resolver: zodResolver(createProductSchema),
		defaultValues
	})

	const onSubmit = async (data: CreateProductSchema) => {
		startUpdateTransition(async () => {
			const { error } = await createProductFromAdmin(data)
			if (error) {
				showErrorToast(error)
				return
			}
			toast.success("Product created successfully!")
			router.push("/dashboard/products")
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
									<FPSelect
										{...field}
										items={units}
										placeholder="Select unit"
									/>
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
										{farmers && farmers.length > 0 ? (
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
					<div className="space-y-2">
						<Button type="submit" className="w-full">
							Add Product
						</Button>
						<Button
							type="button"
							className="w-full"
							variant={"outline"}
							onClick={() => router.back()}
						>
							Cancel
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
