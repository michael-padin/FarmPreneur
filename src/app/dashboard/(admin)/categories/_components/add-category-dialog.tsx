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
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"

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
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button size="icon">
					<Plus className="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="min-w-full">
				<SheetHeader className="text-left">
					<SheetTitle>Create Category</SheetTitle>
					<DrawerDescription>create a new category</DrawerDescription>
				</SheetHeader>
				<div className="pb-0 pt-4">
					<CreateCategoryForm setOpen={setOpen} />
				</div>
				<SheetFooter className="pt-2">
					<SheetClose asChild>
						<Button variant="secondary">Cancel</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
