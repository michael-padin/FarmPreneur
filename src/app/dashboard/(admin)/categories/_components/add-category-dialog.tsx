"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { CreateCategoryForm } from "./create-category-form"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer"
import { Plus } from "lucide-react"

export function AddCategoryDialog() {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button>Add Category</Button>
				</DialogTrigger>
				<DialogContent
					className="max-w-screen-sm"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle>Create Category</DialogTitle>
						<DialogDescription>create a new category</DialogDescription>
					</DialogHeader>
					<CreateCategoryForm setOpen={setOpen} />
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button size="icon">
					<Plus className="h-4 w-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Create Category</DrawerTitle>
					<DrawerDescription>create a new category</DrawerDescription>
				</DrawerHeader>
				<CreateCategoryForm setOpen={setOpen} />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
