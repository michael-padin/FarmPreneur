"use client"

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
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
	id: string
	name: string
	email: string
	role: string
	isSellerApproved: boolean
	isVerified: boolean
	createdAt: string
}

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />
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
		accessorKey: "role",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const user = row.original

			return (
				<Badge
					variant={
						user.role === "ADMIN"
							? "destructive"
							: user.role === "FARMER"
								? "default"
								: "secondary"
					}
				>
					{user.role}
				</Badge>
			)
		},
		filterFn: (row, id, value: string[]) => {
			return value.length === 0 ? true : value.includes(row.getValue(id))
		}
	},
	{
		accessorKey: "isSellerApproved",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Seller Approval" />
		),
		cell: ({ row }) => {
			const user = row.original

			return user.role === "FARMER" ? (
				<Badge variant={user.isSellerApproved ? "default" : "outline"}>
					{user.isSellerApproved ? "Approved" : "Pending"}
				</Badge>
			) : (
				<Badge variant="secondary">N/A</Badge>
			)
		}
	},
	{
		accessorKey: "isVerified",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Verification" />
		),
		cell: ({ row }) => {
			const user = row.original

			return (
				<Badge variant={user.isVerified ? "default" : "outline"}>
					{user.isVerified ? "Verified" : "Unverified"}
				</Badge>
			)
		},
		filterFn: (row, id, value) => {
			return value.length === 0
				? true
				: value.includes(row.getValue(id) ? "Verified" : "Unverified")
		}
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const user = row.original
			return (
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
							onClick={() => navigator.clipboard.writeText(user.id)}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={`/users/${user.id}`}>View details</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={`/users/${user.id}/edit`}>Edit user</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => console.log("Delete user", user.id)}
						>
							Delete user
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]
