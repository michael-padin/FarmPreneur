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
import { showErrorToast } from "@/lib/handle-error"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { processMediaUpdate } from "@/utils/media"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createProduct } from "../actions"
import { createProductSchema, CreateProductSchema } from "../validations"

const defaultValues: CreateProductSchema = {
	title: "",
	description: "",
	price: 0,
	unit: "",
	quantity: 0,
	categoryId: "",
	images: []
}
interface CreateProductFormProps {
	userId: string
	categoriesPromise: Awaited<ReturnType<typeof getCategoriesUseCase>>
}
export function CreateProductForm({
	userId,
	categoriesPromise
}: CreateProductFormProps) {
	const router = useRouter()

	const [isUpdatePending, startUpdateTransition] = useTransition()
	const form = useForm<CreateProductSchema>({
		resolver: zodResolver(createProductSchema),
		defaultValues
	})

	const onSubmit = async (data: CreateProductSchema) => {
		startUpdateTransition(async () => {
			const finalProductImages = await processMediaUpdate({
				currentFiles: [],
				newFiles: data.images,
				userId: userId,
				path: "product-images"
			})
			const { error } = await createProduct({
				...data,
				images: finalProductImages ?? []
			})
			if (error) {
				showErrorToast(error)
				return
			}
			toast.success("Product created successfully!", {
				position: "top-right"
			})
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
									<FPMediaUploader
										onChange={field.onChange}
										initialMedia={[]}
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
										<Input type="number" placeholder="Enter price" {...field} />
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
