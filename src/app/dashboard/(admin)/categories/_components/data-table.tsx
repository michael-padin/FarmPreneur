"use client"

import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState
} from "@tanstack/react-table"

import { DataTablePagination } from "@/app/dashboard/_components/data-table-pagination"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { use, useCallback, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { getCommonPinningStyles } from "@/lib/data-table"
import { getCategoriesUseCase } from "@/use-cases/categories"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import {
	Calendar,
	ChevronRight,
	LinkIcon,
	MoreVertical,
	Package,
	RotateCcw
} from "lucide-react"
import Image from "next/image"
import { columns } from "./columns"
// import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface DataTableProps {
	data: Promise<Awaited<ReturnType<typeof getCategoriesUseCase>>>
}

export function DataTable({ data }: DataTableProps) {
	const categories = use(data)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const table = useReactTable({
		data: categories,
		columns: columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility
		},
		initialState: {
			columnPinning: { right: ["actions"] }
		}
	})

	const resetAll = useCallback(() => {
		setSorting([])
		setColumnFilters([])
		table.resetColumnVisibility()
		table.resetRowSelection()
		table.resetPagination()
	}, [table])

	const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

	const toggleDescription = (id: string) => {
		setExpandedCategory(expandedCategory === id ? null : id)
	}

	return (
		<>
			<div className="mb-4 flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
				<Input
					placeholder="Filter name..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="flex space-x-2">
					{/* <Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 border-dashed">
								<Filter className="mr-2 h-4 w-4" />
								Filter
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<Sheetname>Filter Users</Sheetname>
								<SheetDescription>
									Apply filters to refine the user list.
								</SheetDescription>
							</SheetHeader>
							<div className="grid gap-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="verification">Verification Status</Label>
									<div className="flex flex-wrap gap-2 lg:grid lg:grid-cols-3 lg:gap-2">
										{["Verified", "Unverified"].map((status) => (
											<Label
												key={status}
												className="flex items-center space-x-2 rounded-md border p-2"
											>
												<Checkbox
													id={status}
													checked={(
														table
															.getColumn("isEmailVerified")
															?.getFilterValue() as string[]
													)?.includes(status)}
													onCheckedChange={(checked) => {
														if (checked) {
															table
																.getColumn("isEmailVerified")
																?.setFilterValue((old: string[]) => [
																	...(old || []),
																	status
																])
														} else {
															table
																.getColumn("isEmailVerified")
																?.setFilterValue((old: string[]) =>
																	old?.filter((item) => item !== status)
																)
														}
													}}
												/>
												<span>{status}</span>
											</Label>
										))}
									</div>
								</div>
							</div>
						</SheetContent>
					</Sheet> */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant="outline"
						size="sm"
						className="h-8"
						onClick={resetAll}
					>
						<RotateCcw className="mr-2 h-4 w-4" />
						Reset
					</Button>
				</div>
			</div>
			<div className="hidden rounded-md border lg:block">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											style={{
												...getCommonPinningStyles({ column: header.column })
											}}
										>
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
										<TableCell
											key={cell.id}
											style={{
												...getCommonPinningStyles({ column: cell.column })
											}}
										>
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
			{/* <div className="block md:hidden">
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<Card key={row.id} className="mb-4">
							<CardContent className="space-y-2 p-4">
								<div className="mb-2 flex items-center justify-between">
									<div className="font-semibold">{row.getValue("name")}</div>
									<RoleBadge role={row.getValue("role")} />
								</div>
								<div className="flex items-center space-x-2">
									<span className="text-xs">{row.getValue("id")}</span>
									<CopyToClipboard value={row.getValue("id")} />
								</div>
								<div className="mb-2 text-sm text-gray-500">
									{row.getValue("email")}
								</div>

								<div className="flex items-center justify-between text-xs">
									<div className="col-span-2">Email Verification: </div>
									<VerificationBadge isEmailVerified={row.getValue("isEmailVerified")} />
								</div>
								{row.getValue("role") === "FARMER" ? (
									<div className="flex items-center justify-between text-xs">
										<div className="col-span-2">Application Status: </div>
										<FarmerApprovalBadge
											status={row.getValue("farmerApproval")}
										/>
									</div>
								) : (
									<div className="flex items-center justify-between text-xs">
										<div className="col-span-2">Application Status: </div>
										<Badge variant="secondary">N/A</Badge>
									</div>
								)}
								<div className="flex items-center justify-between text-xs">
									<span className="col-span-2">Created: </span>
									<span>{formatDate(row.getValue("createdAt"))}</span>
								</div>
								<div className="mt-4 flex items-center justify-end">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem asChild>
												<Link href={`/users/${row.getValue("id")}`}>
													View details
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href={`/users/${row.getValue("id")}/edit`}>
													Edit user
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() =>
													console.log("Delete user", row.getValue("id"))
												}
											>
												Delete user
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<div className="p-4 text-center">No results.</div>
				)}
			</div> */}
			{/* Mobile Category Cards */}
			<div className="grid gap-4 md:hidden">
				{categories.map((category) => (
					<Card key={category.id} className="overflow-hidden">
						<CardContent className="p-0">
							<div className="flex items-center gap-3 bg-muted p-3">
								<div className="relative h-16 w-16 flex-shrink-0">
									<Image
										src={category.image || "/placeholder.svg"}
										alt={category.name}
										fill
										className="rounded-md object-cover"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="truncate font-semibold">{category.name}</h3>
									<button
										onClick={() => toggleDescription(category.id)}
										className="mt-1 flex items-center text-sm text-primary"
									>
										{expandedCategory === category.id
											? "Hide details"
											: "Show details"}
										<ChevronRight
											className={`ml-1 h-4 w-4 transition-transform ${expandedCategory === category.id ? "rotate-90" : ""}`}
										/>
									</button>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem>Edit</DropdownMenuItem>
										<DropdownMenuItem>Delete</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<div
								className={`space-y-2 p-3 ${expandedCategory === category.id ? "" : "hidden"}`}
							>
								<p className="text-sm text-muted-foreground">
									{category.description}
								</p>
							</div>
							<div className="space-y-2 p-3">
								<div className="flex items-center gap-2">
									<Badge variant="secondary" className="text-xs font-normal">
										<Package className="mr-1 h-3 w-3" />
										{category._count.products} Products
									</Badge>
									<Badge variant="secondary" className="text-xs font-normal">
										<LinkIcon className="mr-1 h-3 w-3" />
										{category.slug}
									</Badge>
								</div>
								<div className="flex justify-between text-xs text-muted-foreground">
									<div className="flex items-center">
										<Calendar className="mr-1 h-3 w-3" />
										Created:{" "}
										{format(new Date(category.createdAt), "MMM d, yyyy")}
									</div>
									<div className="flex items-center">
										<Calendar className="mr-1 h-3 w-3" />
										Updated:{" "}
										{format(new Date(category.updatedAt), "MMM d, yyyy")}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			<DataTablePagination table={table} />
		</>
	)
}
