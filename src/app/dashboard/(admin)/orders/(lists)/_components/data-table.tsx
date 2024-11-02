"use client"

import * as React from "react"
import {
	CaretSortIcon,
	ChevronDownIcon,
	DotsHorizontalIcon
} from "@radix-ui/react-icons"
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table"
import { useQueryState } from "nuqs"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

const categories = [
	{ value: "fruits", label: "Fruits" },
	{ value: "vegetables", label: "Vegetables" },
	{ value: "dairy", label: "Dairy" },
	{ value: "meat", label: "Meat" },
	{ value: "bakery", label: "Bakery" }
]

const statuses = [
	{
		value: "in stock",
		label: "In Stock"
	},
	{
		value: "low stock",
		label: "Low Stock"
	},
	{
		value: "out of stock",
		label: "Out of Stock"
	}
]

export type Product = {
	id: string
	name: string
	category: string
	price: number
	status: string
}

export const columns: ColumnDef<Product>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: "name",
		header: "Product Name",
		cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("category")}</div>
		)
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("status")}</div>
		)
	},
	{
		accessorKey: "price",
		header: () => <div className="text-right">Price</div>,
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("price"))
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD"
			}).format(price)

			return <div className="text-right font-medium">{formatted}</div>
		}
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const product = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<DotsHorizontalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(product.id)}
						>
							Copy product ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View product details</DropdownMenuItem>
						<DropdownMenuItem>Update stock</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]

export default function ProductTable() {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const [products, setProducts] = React.useState<Product[]>([])

	const [search, setSearch] = useQueryState("search", { defaultValue: "" })
	const [status, setStatus] = useQueryState("status", { defaultValue: "all" })
	const [category, setCategory] = useQueryState("category", {
		defaultValue: "all"
	})

	React.useEffect(() => {
		// Simulating API call to fetch products
		const fetchProducts = async () => {
			// Replace this with your actual API call
			const dummyProducts: Product[] = [
				{
					id: "1",
					name: "Apple",
					category: "fruits",
					price: 0.5,
					status: "in stock"
				},
				{
					id: "2",
					name: "Banana",
					category: "fruits",
					price: 0.3,
					status: "low stock"
				},
				{
					id: "3",
					name: "Milk",
					category: "dairy",
					price: 2.5,
					status: "in stock"
				},
				{
					id: "4",
					name: "Bread",
					category: "bakery",
					price: 1.5,
					status: "out of stock"
				},
				{
					id: "5",
					name: "Chicken",
					category: "meat",
					price: 5.0,
					status: "in stock"
				}
			]
			setProducts(dummyProducts)
		}

		fetchProducts()
	}, [])

	const table = useReactTable({
		data: products,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		}
	})

	React.useEffect(() => {
		if (search) {
			table.getColumn("name")?.setFilterValue(search)
		}
		if (status !== "all") {
			table.getColumn("status")?.setFilterValue(status)
		}
		if (category !== "all") {
			table.getColumn("category")?.setFilterValue(category)
		}
	}, [search, status, category, table])

	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter products..."
					value={search ?? ""}
					onChange={(event) => setSearch(event.target.value)}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Status <ChevronDownIcon className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{statuses.map((item) => (
							<DropdownMenuCheckboxItem
								key={item.value}
								className="capitalize"
								checked={status === item.value}
								onCheckedChange={() => setStatus(item.value)}
							>
								{item.label}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-2">
							Category <ChevronDownIcon className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{categories.map((item) => (
							<DropdownMenuCheckboxItem
								key={item.value}
								className="capitalize"
								checked={category === item.value}
								onCheckedChange={() => setCategory(item.value)}
							>
								{item.label}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
