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
import { getCategories } from "@/data-access/categories"
import { formatDate } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { CategoryImageCell } from "./category-image-cell"
import { DeleteCategoriesDialog } from "./delete-categories-dialog"
import { UpdateCategoryDialog } from "./update-category-dialog"

export const columns: ColumnDef<
	Awaited<ReturnType<typeof getCategories>>[0]
>[] = [
	{
		id: "image",
		accessorKey: "image",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Image" />
		),
		cell: ({ row }) => {
			const image = row.original.image
			return image && <CategoryImageCell image={image} />
		}
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const name = row.original.name
			return <span className="w-max">{name}</span>
		}
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Description" />
		),
		enableSorting: true,
		cell: ({ cell }) => {
			return <p className="w-52">{cell.getValue() as string}</p>
		}
	},
	{
		accessorKey: "slug",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Slug" />
		),
		enableSorting: true
	},
	{
		accessorKey: "_count.products",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Products" />
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
			const [showUpdateDialog, setShowUpdateDialog] = useState(false)
			const category = row.original

			return (
				<>
					<DeleteCategoriesDialog
						open={showProductDialog}
						onOpenChange={setShowProductDialog}
						ids={[category.id]}
						showTrigger={false}
						onSuccess={() => row.toggleSelected(false)}
					/>
					<UpdateCategoryDialog
						category={row.original}
						showUpdateDialog={showUpdateDialog}
						setShowUpdateDialog={setShowUpdateDialog}
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
							<DropdownMenuItem onSelect={() => setShowUpdateDialog(true)}>
								Edit
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
