"use client"

import {
	ColumnDef,
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

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { useCallback, useState } from "react"
import { DataTablePagination } from "@/app/dashboard/_components/data-table-pagination"
import { Input } from "@/components/ui/input"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter, RotateCcw } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function DataTable<TData, TValue>({
	columns,
	data
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const table = useReactTable({
		data,
		columns,
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
		<div>
			<div className="mb-4 flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
				<Input
					placeholder="Filter emails..."
					value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("email")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="flex space-x-2">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 border-dashed">
								<Filter className="mr-2 h-4 w-4" />
								Filter
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Filter Users</SheetTitle>
								<SheetDescription>
									Apply filters to refine the user list.
								</SheetDescription>
							</SheetHeader>
							<div className="grid gap-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="role">Role</Label>
									<div className="grid grid-cols-3 gap-2">
										{["FARMER", "BUYER", "ADMIN"].map((role) => (
											<Label
												key={role}
												className="flex items-center space-x-2 rounded-md border p-2"
											>
												<Checkbox
													id={role}
													checked={(
														table
															.getColumn("role")
															?.getFilterValue() as string[]
													)?.includes(role)}
													onCheckedChange={(checked) => {
														if (checked) {
															table
																.getColumn("role")
																?.setFilterValue((old: string[]) => [
																	...(old || []),
																	role
																])
														} else {
															table
																.getColumn("role")
																?.setFilterValue((old: string[]) =>
																	old?.filter((item) => item !== role)
																)
														}
													}}
												/>
												<span>{role}</span>
											</Label>
										))}
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="verification">Verification Status</Label>
									<div className="grid grid-cols-2 gap-2">
										{["Verified", "Unverified"].map((status) => (
											<Label
												key={status}
												className="flex items-center space-x-2 rounded-md border p-2"
											>
												<Checkbox
													id={status}
													checked={(
														table
															.getColumn("isVerified")
															?.getFilterValue() as string[]
													)?.includes(status)}
													onCheckedChange={(checked) => {
														if (checked) {
															table
																.getColumn("isVerified")
																?.setFilterValue((old: string[]) => [
																	...(old || []),
																	status
																])
														} else {
															table
																.getColumn("isVerified")
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
					</Sheet>
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
						Reset All
					</Button>
				</div>
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
			<DataTablePagination table={table} />
		</div>
	)
}
