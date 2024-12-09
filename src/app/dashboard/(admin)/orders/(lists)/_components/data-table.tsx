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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { getCommonPinningStyles } from "@/lib/data-table"
import { getOrdersUseCase } from "@/use-cases/orders"
import { format } from "date-fns"
import { RotateCcw } from "lucide-react"
import { columns } from "./columns"

interface DataTableProps {
	data: Promise<Awaited<ReturnType<typeof getOrdersUseCase>>>
}

export function DataTable({ data }: DataTableProps) {
	const orders = use(data)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const table = useReactTable({
		data: orders,
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
	return (
		<>
			<div className="mb-4 flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
				<Input
					placeholder="Filter customer..."
					value={
						(table.getColumn("customer")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("customer")?.setFilterValue(event.target.value)
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
			<div className="space-y-4 md:hidden">
				{orders.length > 0 ? (
					orders.map((order) => (
						<Card key={order.id} className="overflow-hidden">
							<CardHeader className="border-b bg-muted/40 p-4">
								<div className="flex items-center justify-between">
									<CardTitle className="text-base font-medium">
										{order.id}
									</CardTitle>
									<Badge
										variant={
											order.status === "COMPLETED" ? "default" : "secondary"
										}
									>
										{order.status}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="grid gap-3 p-4 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Date</span>
									<span className="font-medium">
										{format(new Date(order.createdAt), "MMM d, yyyy")}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Product</span>
									<span className="font-medium">
										{order.items[0].product.title}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Customer</span>
									<span className="font-medium">
										{order.customer?.user.name}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Farmer</span>
									<span className="font-medium">{order.farmer?.farmName}</span>
								</div>
								<div className="flex justify-between border-t pt-3">
									<span className="font-medium">Total Price</span>
									<span className="font-bold">{order.totalPrice}</span>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card className="p-6 text-center text-muted-foreground">
						No orders found
					</Card>
				)}
			</div>
			<DataTablePagination table={table} />
		</>
	)
}
