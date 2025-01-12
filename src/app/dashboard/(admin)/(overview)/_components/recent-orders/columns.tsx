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
import { formatPHP } from "@/lib/utils"
import { getRecentOrdersUseCase } from "@/use-cases/orders"
import { Order, OrderStatus } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Package, Phone, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { OrderStatusBadge } from "../../../users/(lists)/_components/badges"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getRecentOrdersUseCase>>[0]
>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Order ID"
				className="min-w-max"
			/>
		),
		cell: ({ cell }) => {
			const id = cell.getValue() as string
			return <p>{id.slice(-5)}</p>
		},
		enableSorting: false
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date" />
		),
		cell: ({ row }) => {
			const createdAt = row.original.createdAt
			return (
				<div className="flex flex-col text-sm">
					<span>{new Date(createdAt).toLocaleDateString()}</span>
					<span className="text-gray-500">
						{new Date(createdAt).toLocaleTimeString()}
					</span>
				</div>
			)
		},
		enableSorting: false
	},

	{
		accessorKey: "product",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Product" />
		),
		cell: ({ row }) => {
			const product = row.original.items[0].product
			const quantity = row.original.quantity
			return (
				<div className="flex items-center gap-3">
					{product.productImages?.[0] && (
						<div className="relative h-12 w-12 overflow-hidden rounded-md">
							<Image
								src={product.productImages[0] || "/placeholder.svg"}
								alt={product.title}
								fill
								className="h-full w-full object-cover"
							/>
						</div>
					)}
					<div className="flex flex-col">
						<span className="font-medium">{product.title}</span>
						<div className="flex items-center gap-1 text-sm text-gray-500">
							<Package className="h-3 w-3" />
							<span className="w-max">
								{product.quantity} {product.unit}
							</span>
						</div>
					</div>
				</div>
			)
		},
		enableSorting: false
	},

	{
		accessorKey: "customer",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Customer" />
		),
		enableSorting: false,
		cell: ({ row }) => {
			const customer = row.original.customer
			return customer ? (
				<div className="flex flex-col">
					<div className="flex items-center gap-1">
						<User className="h-4 w-4" />
						<span>{customer.user.name}</span>
					</div>
					<div className="flex items-center gap-1 text-sm text-gray-500">
						<Phone className="h-3 w-3" />
						<span>{customer.contactNumber}</span>
					</div>
				</div>
			) : null
		}
	},
	{
		accessorKey: "farmer",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Farmer" />
		),
		enableSorting: false,
		cell: ({ row }) => {
			const farmer = row.original.farmer
			return farmer ? (
				<div className="flex flex-col">
					<div className="flex items-center gap-1">
						<User className="h-4 w-4" />
						<span>{farmer.user.name}</span>
					</div>
					<div className="flex items-center gap-1 text-sm text-gray-500">
						<Phone className="h-3 w-3" />
						<span>{farmer.contactNumber}</span>
					</div>
				</div>
			) : null
		}
	},

	{
		accessorKey: "totalPrice",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Total Price"
				className="min-w-max"
			/>
		),
		cell: ({ cell }) => {
			const totalPrice = cell.getValue() as Order["totalPrice"]
			return (
				<>
					<p>₱{formatPHP(Number(totalPrice))}</p>
				</>
			)
		},
		enableSorting: false
	},

	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		enableSorting: false,
		cell: ({ cell }) => {
			const status = cell.getValue() as OrderStatus

			return <OrderStatusBadge status={status} showText />
		}
	},

	{
		id: "actions",
		cell: function Cell({ row }) {
			const [showProductDialog, setShowProductDialog] = useState(false)
			const [showUpdateDialog, setShowUpdateDialog] = useState(false)
			const category = row.original

			return (
				<>
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
							<DropdownMenuItem
								onSelect={() => setShowUpdateDialog(true)}
								asChild
							>
								<Link href={`/dashboard/orders/${row.original.id}`}>
									View Details
								</Link>
							</DropdownMenuItem>
							{/* <DropdownMenuItem onSelect={() => setShowUpdateDialog(true)}>
								Update Status
							</DropdownMenuItem> */}
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={() => setShowProductDialog(true)}>
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
