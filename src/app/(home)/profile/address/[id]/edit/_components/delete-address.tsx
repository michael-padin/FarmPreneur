import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteAddress } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { Loader2, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function DeleteAddress({ id }: { id: string }) {
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const [isDeletePending, startDeleteTransition] = useTransition()

	const handleDelete = async () => {
		startDeleteTransition(async () => {
			const { error } = await deleteAddress(id)

			if (error) {
				showErrorToast(error)
				return
			}
			toast.success("Address deleted successfully", {
				position: "top-right"
			})
			router.push("/profile/address")
			setIsOpen(false)
		})
	}

	return (
		<AlertDialog onOpenChange={setIsOpen} open={isOpen}>
			<AlertDialogTrigger asChild>
				<Button
					type="button"
					className="w-full flex-1"
					variant={"destructive"}
					disabled={isDeletePending}
				>
					<Trash className="h-4 w-4" />
					<span className="sr-only">Delete</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. Deleting this address will permanently
						remove it from your account.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeletePending}>
						Cancel
					</AlertDialogCancel>
					<Button
						variant={"destructive"}
						disabled={isDeletePending}
						onClick={handleDelete}
					>
						{isDeletePending ? <Loader2 className="animate-spin" /> : "Delete"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
