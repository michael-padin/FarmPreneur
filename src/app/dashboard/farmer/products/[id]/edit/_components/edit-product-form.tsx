"use client"
import { FPMediaUploader } from "@/components/fp/fp-media-uploader"
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
import { units } from "@/constants/unit"
import { getCategories } from "@/data-access/categories"
import { editProduct } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { getProductByIdFromFarmerUseCase } from "@/use-cases/products"
import { processMediaUpdate } from "@/utils/media"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { editProductSchema, EditProductSchema } from "../validations"

interface EditProductFormProps {
	categories: Awaited<ReturnType<typeof getCategories>>
	product: Awaited<ReturnType<typeof getProductByIdFromFarmerUseCase>>
}
export function EditProductForm({ product, categories }: EditProductFormProps) {
	const router = useRouter()

	const [isUpdatePending, startUpdateTransition] = useTransition()
	const form = useForm<EditProductSchema>({
		resolver: zodResolver(editProductSchema),
		defaultValues: {
			title: product.title,
			description: product.description,
			price: product.price,
			unit: product.unit,
			quantity: product.quantity,
			categoryId: product.categoryId,
			images: product.productImages
		}
	})

	const onSubmit = async (data: EditProductSchema) => {
		startUpdateTransition(async () => {
			const finalProductImages = await processMediaUpdate({
				currentFiles: product.productImages,
				newFiles: data.images,
				userId: product.userId || "",
				path: "product-images"
			})
			const { error } = await editProduct({
				...data,
				images: finalProductImages || [],
				productId: product.id
			})
			if (error) {
				showErrorToast(error)
				return
			}
			toast.success("Product updated successfully!", {
				closeButton: true,
				duration: 2000,
				position: "top-right"
			})
			router.push("/dashboard/farmer/products")
		})
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset
					className="relative space-y-4 rounded-lg bg-background p-2"
					disabled={isUpdatePending}
				>
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
									<FPMediaUploader
										initialMedia={product.productImages}
										onChange={field.onChange}
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
									<FormLabel>Unit</FormLabel>
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

					<div className="fixed bottom-0 left-0 right-0 z-10 flex bg-background p-4">
						<Button
							type="submit"
							className="w-full"
							disabled={isUpdatePending || !form.formState.isDirty}
						>
							{isUpdatePending ? "Updating..." : "Update Product"}
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
