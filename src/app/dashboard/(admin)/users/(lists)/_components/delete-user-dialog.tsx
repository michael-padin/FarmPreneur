"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
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
import { Icons } from "@/components/icons"
import { useTransition } from "react"
import { deleteUsers } from "../actions"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getUsersUseCase } from "@/use-cases/users"

interface DeleteUsersDialogProps
	extends React.ComponentPropsWithoutRef<typeof Dialog> {
	users: Row<Awaited<ReturnType<typeof getUsersUseCase>>[0]>["original"][]
	showTrigger?: boolean
	onSuccess?: () => void
}

export function DeleteUsersDialog({
	users,
	showTrigger = true,
	onSuccess,
	...props
}: DeleteUsersDialogProps) {
	const [isDeletePending, startDeleteTransition] = useTransition()
	const isDesktop = useMediaQuery("(min-width: 640px)")

	function onDelete() {
		startDeleteTransition(async () => {
			const { error } = await deleteUsers({
				ids: users.map((task) => task.id)
			})

			if (error) {
				toast.error(error)
				return
			}

			props.onOpenChange?.(false)
			toast.success("users deleted")
			onSuccess?.()
		})
	}

	if (isDesktop) {
		return (
			<Dialog {...props}>
				{showTrigger ? (
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							<TrashIcon className="mr-2 size-4" aria-hidden="true" />
							Delete ({users.length})
						</Button>
					</DialogTrigger>
				) : null}
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete{" "}
							<span className="font-medium">{users.length}</span>
							{users.length === 1 ? " user" : " users"} to our servers.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:space-x-0">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button
							aria-label="Delete selected rows"
							variant="destructive"
							onClick={onDelete}
							disabled={isDeletePending}
						>
							{isDeletePending && (
								<Icons.spinner
									className="mr-2 size-4 animate-spin"
									aria-hidden="true"
								/>
							)}
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer {...props}>
			{showTrigger ? (
				<DrawerTrigger asChild>
					<Button variant="outline" size="sm">
						<TrashIcon className="mr-2 size-4" aria-hidden="true" />
						Delete ({users.length})
					</Button>
				</DrawerTrigger>
			) : null}
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
					<DrawerDescription>
						This action cannot be undone. This will permanently delete{" "}
						<span className="font-medium">{users.length}</span>
						{users.length === 1 ? " user" : " users"} to our servers.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="gap-2 sm:space-x-0">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={onDelete}
						disabled={isDeletePending}
					>
						{isDeletePending && (
							<Icons.spinner
								className="mr-2 size-4 animate-spin"
								aria-hidden="true"
							/>
						)}
						Delete
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
