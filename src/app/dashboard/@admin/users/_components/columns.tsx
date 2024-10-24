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
import { Address, ROLE } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { RoleBadge, VerificationBadge } from "./badges"
import { formatDate } from "@/lib/utils"
import { UpdateUserSheet } from "./update-user-sheet"
import { useState } from "react"
import { getUsersUseCase } from "@/use-cases/users"
import { DeleteUsersDialog } from "./delete-user-dialog"
import { toast } from "sonner"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getUsersUseCase>>[0]
>[] = [
	// {
	// 	enableHiding: true,
	// 	accessorKey: "id",
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title="ID" />
	// 	),
	// 	cell: ({ row }) => {
	// 		const id = row.getValue("id") as string
	// 		return (
	// 			<div className="flex items-center space-x-2">
	// 				<CopyToClipboard value={id} />
	// 				<span>{id}</span>
	// 			</div>
	// 		)
	// 	}
	// },
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
		accessorKey: "role",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const role = row.getValue("role") as ROLE
			return <RoleBadge role={role} />
		},
		filterFn: (row, id, value: string[]) => {
			return value.length === 0 ? true : value.includes(row.getValue(id))
		}
	},
	{
		accessorKey: "Address",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Address" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const address = row.getValue("Address") as Address
			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<p className="w-[200px] truncate">{address?.fullAddress}</p>
						</TooltipTrigger>
						<TooltipContent className="w-[200px]">
							<p>{address?.fullAddress}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)
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
			const [showUpdateUserSheet, setShowUpdateUserSheet] = useState(false)
			const user = row.original

			return (
				<>
					<UpdateUserSheet
						user={user}
						open={showUpdateUserSheet}
						onOpenChange={setShowUpdateUserSheet}
					/>
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
								<Link href={`/users/${user.id}`}>View details</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setShowUpdateUserSheet(true)}>
								Edit
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
