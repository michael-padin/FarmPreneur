"use client"

import CopyToClipboard from "@/app/dashboard/_components/copy-to-clipboard"
import { DataTableColumnHeader } from "@/app/dashboard/_components/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { FarmerApproval, ROLE } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { FarmerApprovalBadge, RoleBadge, VerificationBadge } from "./badges"
import { formatDate } from "@/lib/utils"
import { UpdateUserSheet } from "./update-user-sheet"
import { useState } from "react"
import { getUsersUseCase } from "@/use-cases/users"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getUsersUseCase>>[0]
>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="ID" />
		),
		enableSorting: false,
		cell: ({ row }) => {
			const id = row.getValue("id") as string
			return (
				<div className="flex items-center space-x-2">
					<CopyToClipboard value={id} />
					<span className="w-[50px] truncate text-xs">{id}</span>
				</div>
			)
		}
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		enableSorting: true
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
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created At" />
		),
		cell: ({ cell }) => formatDate(cell.getValue() as Date)
	},
	{
		accessorKey: "farmerApproval",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Farmer Approval"
				className="w-max"
			/>
		),
		cell: ({ row }) => {
			const role = row.getValue("role") as ROLE
			const farmerApproval = row.getValue("farmerApproval") as FarmerApproval
			if (role !== "FARMER") {
				return <Badge variant="secondary">N/A</Badge>
			}
			return <FarmerApprovalBadge status={farmerApproval} />
		},
		enableSorting: false
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
			const [showUpdateTaskSheet, setShowUpdateTaskSheet] = useState(false)
			const user = row.original
			return (
				<>
					<UpdateUserSheet
						user={user}
						open={showUpdateTaskSheet}
						onOpenChange={setShowUpdateTaskSheet}
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
							<DropdownMenuItem asChild>
								<Link href={`/users/${user.id}`}>View details</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
								Edit user
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => console.log("Delete user", user.id)}
							>
								Delete user
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			)
		},
		size: 40,
		enableHiding: false
	}
]
