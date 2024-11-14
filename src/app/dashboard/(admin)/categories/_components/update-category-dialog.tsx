"use client"
import React from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from "@/components/ui/drawer"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"

import { createCategorySchema, CreateCategorySchema } from "../validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"
import { S3PATH } from "@/constants/s3-path"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { showErrorToast } from "@/lib/handle-error"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { updateCategory } from "../actions"

interface UpdateCategoryDialogProps {
	category: Awaited<ReturnType<typeof getCategoriesUseCase>>[0]
	showUpdateDialog: boolean
	setShowUpdateDialog?: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateCategoryDialog({
	category,
	showUpdateDialog,
	setShowUpdateDialog
}: UpdateCategoryDialogProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)")

	if (isDesktop) {
		return (
			<Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
				{/* <DialogTrigger asChild>Edit</DialogTrigger> */}
				<DialogContent
					className="max-w-screen-sm"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle>Create Category</DialogTitle>
						<DialogDescription>create a new category</DialogDescription>
					</DialogHeader>
					<CreateCategoryForm
						setOpen={setShowUpdateDialog}
						category={category}
					/>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
			{/* <DrawerTrigger asChild>Edit</DrawerTrigger> */}
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Create Category</DrawerTitle>
					<DrawerDescription>create a new category</DrawerDescription>
				</DrawerHeader>
				<CreateCategoryForm setOpen={setShowUpdateDialog} category={category} />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

interface CreateCategoryFormProps {
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
	category: Awaited<ReturnType<typeof getCategoriesUseCase>>[0]
}

export function CreateCategoryForm({
	setOpen,
	category
}: CreateCategoryFormProps) {
	const [isPending, startTransition] = useTransition()
	const form = useForm<CreateCategorySchema>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			name: category.name || "",
			description: category.description || "",
			image: {
				url: category.image?.url,
				filename: category.image?.filename || "",
				size: category.image?.size || 0,
				mimeType: category.image?.mimeType || ""
			}
		}
	})

	const onSubmit = (data: CreateCategorySchema) => {
		startTransition(async () => {
			const { error } = await updateCategory({
				...data,
				categoryId: category.id
			})

			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Category created successfully!")
			setOpen?.(false)
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="grid gap-4 max-sm:px-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Fruits" {...field} />
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
									<Textarea placeholder="fruits are ..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category Image</FormLabel>
								<FormControl>
									<FileUpload
										path={S3PATH.CATEGORIES}
										{...field}
										value={field.value}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isPending || !form.formState.isDirty}>
						{isPending ? <Loader2 className="animate-spin" /> : "Save	"}
					</Button>{" "}
				</fieldset>
			</form>
		</Form>
	)
}
