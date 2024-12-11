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
import { getPendingFarmersUseCase } from "@/use-cases/farmers"
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
import { VerificationDocumentCell } from "./verificationDocument"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getPendingFarmersUseCase>>[0]
>[] = [
	{
		id: "name",
		accessorKey: "user.name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		enableSorting: true
	},
	{
		id: "email",
		accessorKey: "user.email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		enableSorting: true
	},
	{
		id: "birth date",
		accessorKey: "birthDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Birth Date" />
		),
		cell: ({ cell }) => (
			<div className="w-max">{formatDate(cell.getValue() as Date)}</div>
		)
	},
	{
		id: "contact",
		accessorKey: "contactNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Contact" />
		),
		enableSorting: true
	},
	{
		accessorKey: "address",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Address" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const address = row.original.address
			const name = row.original.user.name
			return address && name ? (
				<div>
					<p className="w-[180px] truncate">{address[0]?.fullAddress}</p>
					<AddressDetailsDrawerDialog
						title={`${name}'s Address`}
						address={address[0]}
					/>
				</div>
			) : (
				"N/A"
			)
		},
		size: 40
	},

	{
		id: "document",
		accessorKey: "verificationDocument",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Verification Document"
				className="min-w-max"
			/>
		),
		cell: ({ row }) => {
			const image = row.original.verificationDocument?.image

			return image && <VerificationDocumentCell image={image} />
		},
		enableSorting: false
	},
	{
		id: "application status",
		accessorKey: "farmerApplicationStatus",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Application Status"
				className="min-w-max"
			/>
		),
		cell: ({ row }) => {
			const farmerApplicationStatus = row.original.applicationStatus
			return (
				farmerApplicationStatus && (
					<FarmerApprovalBadge status={farmerApplicationStatus} />
				)
			)
		},
		enableSorting: false
	},
	{
		id: "email verification",
		accessorKey: "user.isEmailVerified",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Email Verification"
				className="w-max"
			/>
		),
		cell: ({ row }) => {
			const isEmailVerified = row.original.user.isEmailVerified
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
			<p className="w-max">{formatDate(cell.getValue() as Date)}</p>
		)
	},
	{
		id: "actions",
		cell: function Cell({ row }) {
			const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false)
			const id = row.original.user.id

			return (
				<>
					<DeleteUsersDialog
						open={showDeleteUserDialog}
						onOpenChange={setShowDeleteUserDialog}
						ids={[id]}
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
								<Link href={`/dashboard/users/${id}`}>Details</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={`/dashboard/users/${id}/edit`}>Edit</Link>
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
