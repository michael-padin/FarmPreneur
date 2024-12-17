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
import { UnitKey, UNITS_MAP } from "@/constants/unit"
import { formatDate, formatPHP } from "@/lib/utils"
import { getAllProductsUseCase } from "@/use-cases/products"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { ProductListingStatusBadge } from "../../../users/(lists)/_components/badges"
import { DeleteProductsDialog } from "./delete-products-dialog"
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
			const images = row.original.productImages
			return (
				images && (
					<ProductImageCell images={images} altText={row.original.title} />
				)
			)
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
		id: "Status",
		accessorKey: "listingStatus",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Listing Status" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const product = row.original
			return <ProductListingStatusBadge status={product.listingStatus} />
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
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<p>
					{formatPHP(row.original.price)}/
					{UNITS_MAP[row.original.unit as UnitKey].abbreviation}
				</p>
			)
		}
	},
	{
		accessorKey: "unit",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Unit" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			return (
				row.original.unit && (
					<p>{UNITS_MAP[row.original.unit as UnitKey].name}</p>
				)
			)
		}
	},
	{
		accessorKey: "quantity",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Quantity" />
		),
		enableSorting: true,
		cell: ({ row }) => <p className="text-center">{row.original.quantity}</p>
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
					<DeleteProductsDialog
						open={showProductDialog}
						onOpenChange={setShowProductDialog}
						ids={[product.id]}
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
