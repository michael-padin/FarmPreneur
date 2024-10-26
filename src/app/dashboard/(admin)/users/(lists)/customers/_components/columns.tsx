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
import { getCustomersUseCase } from "@/use-cases/users"
import { toast } from "sonner"
import { VerificationBadge } from "../../_components/badges"
import { DeleteUsersDialog } from "../../_components/delete-user-dialog"
import { AddressDetailsDrawerDialog } from "../../_components/address-details"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getCustomersUseCase>>[0]
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
		accessorKey: "orderCount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Orders" />
		)
	},
	{
		accessorKey: "totalSpend",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Total Spend" />
		),
		cell: ({ row }) => {
			const totalSpend = row.original.totalSpend
			return (
				<p>
					<span className="text-xs">₱</span>
					{totalSpend}
				</p>
			)
		}
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
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Updated At" />
		),
		cell: ({ row }) => formatDate(row.original.updatedAt as Date)
	},
	{
		accessorKey: "lastOrderDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Order Date" />
		),
		cell: ({ row }) => {
			const lastOrderDate = row.original.lastOrderDate
			return <span>{lastOrderDate ? formatDate(lastOrderDate) : "N/A"}</span>
		}
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		)
	},

	{
		accessorKey: "isVerified",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Verification" />
		),
		cell: ({ row }) => {
			const isVerified = row.getValue("isVerified") as boolean
			return <VerificationBadge isVerified={isVerified} />
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
