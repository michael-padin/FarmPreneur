"use client"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import React from "react"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"

import { FPMediaUploader } from "@/components/fp/fb-media-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { showErrorToast } from "@/lib/handle-error"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { processMediaUpdate } from "@/utils/media"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateCategory } from "../actions"
import { createCategorySchema, CreateCategorySchema } from "../validation"

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
						<DialogTitle>Update Category</DialogTitle>
						<DialogDescription>Update existing category</DialogDescription>
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
					<DrawerTitle>Update Category</DrawerTitle>
					<DrawerDescription>Update existing category</DrawerDescription>
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
			image: category.image
				? {
						id: Math.random().toString(36).substring(7),
						url: category.image || "",
						type: "image" as "image" | "video",
						file: null
					}
				: null
		}
	})

	const onSubmit = (data: CreateCategorySchema) => {
		startTransition(async () => {
			const finalCategoryImage = await processMediaUpdate({
				currentFiles: category.image
					? {
							id: Math.random().toString(36).substring(7),
							url: category.image || "",
							type: "image" as "image" | "video",
							file: null
						}
					: null,
				newFiles: data.image,
				path: "categories"
			})
			const { error } = await updateCategory({
				...data,
				categoryId: category.id,
				image: finalCategoryImage[0]
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
									<FPMediaUploader {...field} initialMedia={[]} singleImage />
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
