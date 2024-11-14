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
import { toast } from "sonner"
import { AddressDetailsDrawerDialog } from "./address-details"
import { getAllProductsUseCase } from "@/use-cases/products"
import { DeleteProductDialog } from "./delete-products-dialog"
import { FarmerApprovalBadge } from "../../../users/(lists)/_components/badges"
import { ProductImageCell } from "./product-image-cell"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getAllProductsUseCase>>[0]
>[] = [
	{
		accessorKey: "images",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Images" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const images = row.original.images
			return images && <ProductImageCell images={images} />
		}
	},
	{
		accessorKey: "title",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const name = row.original.title
			return <span className="text-nowrap">{name}</span>
		}
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Description" />
		),
		enableSorting: true
	},
	{
		id: "Farmer",
		accessorKey: "farmer.user.name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Farmer" />
		),
		enableSorting: true
	},
	{
		accessorKey: "price",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price" />
		),
		enableSorting: true
	},
	{
		accessorKey: "pickupLocation",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Pick Up Location" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const { title, pickupLocation } = row.original
			return (
				pickupLocation && (
					<AddressDetailsDrawerDialog address={pickupLocation} title={title} />
				)
			)
		},
		size: 40
	},
	{
		id: "Status",
		accessorKey: "listingStatus",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Listing Status" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const product = row.original
			return <FarmerApprovalBadge status={product.listingStatus} />
		}
	},
	{
		id: "orders",
		accessorKey: "_count.orders",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Orders" />
		),
		enableSorting: true
	},
	{
		id: "reviews",
		accessorKey: "_count.reviews",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Reviews" />
		),
		enableSorting: true
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
		id: "actions",
		cell: function Cell({ row }) {
			const [showProductDialog, setShowProductDialog] = useState(false)
			const product = row.original

			return (
				<>
					{/* <DeleteProductDialog
						open={showProductDialog}
						onOpenChange={setShowProductDialog}
						ids={[product]}
						showTrigger={false}
						deleteAction={()}
						name="product"
						onSuccess={() => row.toggleSelected(false)}
					/> */}
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
								<Link href={`/dashboard/products/${product.id}`}>Details</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={`/dashboard/products/${product.id}/edit`}>
									Edit
								</Link>
							</DropdownMenuItem>
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
