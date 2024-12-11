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
import { formatDate } from "@/lib/utils"
import { getFarmersUseCase } from "@/use-cases/farmers"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { AddressDetailsDrawerDialog } from "../../_components/address-details"
import {
	FarmerApprovalBadge,
	VerificationBadge
} from "../../_components/badges"
import { DeleteUsersDialog } from "../../_components/delete-user-dialog"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getFarmersUseCase>>[0]
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
		id: "contactNumber",
		accessorKey: "farmer.contactNumber",
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
			const { farmer, name } = row.original
			const address = farmer?.address
			return (
				address &&
				name && (
					<div>
						<p className="w-[180px] truncate">{address[0]?.fullAddress}</p>
						<AddressDetailsDrawerDialog
							title={`${name}'s Address`}
							address={address[0]}
						/>
					</div>
				)
			)
		}
	},
	{
		id: "orders",
		accessorKey: "farmer._count.orders",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Orders" />
		),
		enableSorting: true
	},
	{
		id: "products",
		accessorKey: "farmer._count.products",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Products" />
		),
		enableSorting: true
	},
	{
		id: "reviews",
		accessorKey: "farmer._count.reviews",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Reviews" />
		),
		enableSorting: true
	},

	{
		id: "applicationStatus",
		accessorKey: "farmer.applicationStatus",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Application Status"
				className="w-max"
			/>
		),
		cell: ({ row }) => {
			const farmerApplicationStatus = row.original.farmer?.applicationStatus
			return (
				farmerApplicationStatus && (
					<FarmerApprovalBadge status={farmerApplicationStatus} />
				)
			)
		},
		enableSorting: false
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
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created At" />
		),
		cell: ({ cell }) => (
			<div className="w-max">{formatDate(cell.getValue() as Date)}</div>
		)
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Updated At" />
		),
		cell: ({ cell }) => (
			<div className="w-max">{formatDate(cell.getValue() as Date)}</div>
		)
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
						ids={[row.original.id]}
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
