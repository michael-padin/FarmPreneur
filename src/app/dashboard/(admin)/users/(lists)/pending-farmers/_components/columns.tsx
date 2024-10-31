"use client"
import { DataTableColumnHeader } from "@/app/dashboard/_components/data-table-column-header"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { getPendingFarmersUseCase } from "@/use-cases/users"
import { toast } from "sonner"
import { AddressDetailsDrawerDialog } from "../../_components/address-details"
import { DeleteUsersDialog } from "../../_components/delete-user-dialog"
import { VerificationBadge } from "../../_components/badges"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getPendingFarmersUseCase>>[0]
>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const name = row.original.name
			return <span className="text-nowrap">{name}</span>
		}
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		enableSorting: true
	},
	{
		accessorKey: "contactNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Contact" />
		),
		enableSorting: true
	},
	{
		accessorKey: "Address",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Address" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const user = row.original
			return <AddressDetailsDrawerDialog user={user} />
		},
		size: 40
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created At" />
		),
		cell: ({ cell }) => formatDate(cell.getValue() as Date)
	},
	{
		accessorKey: "isEmailVerified",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Verification" />
		),
		cell: ({ row }) => {
			const isEmailVerified = row.getValue("isEmailVerified") as boolean
			return <VerificationBadge isEmailVerified={isEmailVerified} />
		},
		filterFn: (row, id, value) => {
			return value.length === 0
				? true
				: value.includes(row.getValue(id) ? "Verified" : "Unverified")
		},
		enableSorting: false
	},
	{
		id: "actions",
		cell: function Cell({ row }) {
			const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false)
			const user = row.original

			return (
				<>
					<DeleteUsersDialog
						open={showDeleteUserDialog}
						onOpenChange={setShowDeleteUserDialog}
						users={[row.original]}
						showTrigger={false}
						onSuccess={() => row.toggleSelected(false)}
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onSelect={async () => {
									await navigator.clipboard.writeText(row.original.id)
									toast.success("user id copied!")
								}}
							>
								Copy ID
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={`/dashboard/users/${user.id}`}>Details</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={`/dashboard/users/${user.id}/edit`}>Edit</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={() => setShowDeleteUserDialog(true)}>
								Delete
								<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			)
		},
		size: 20,
		enableHiding: false
	}
]
