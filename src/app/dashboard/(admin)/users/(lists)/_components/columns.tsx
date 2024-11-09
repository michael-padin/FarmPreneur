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
import { ROLE } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { RoleBadge, VerificationBadge } from "./badges"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { getUsersUseCase } from "@/use-cases/users"
import { DeleteUsersDialog } from "./delete-user-dialog"
import { toast } from "sonner"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getUsersUseCase>>[0]
>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="ID" className="w-min" />
		),
		enableSorting: false,
		cell: ({ row }) => <span className="max-w-min">{row.original.id}</span>
	},
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
		accessorKey: "isEmailVerified",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email Verification" />
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
