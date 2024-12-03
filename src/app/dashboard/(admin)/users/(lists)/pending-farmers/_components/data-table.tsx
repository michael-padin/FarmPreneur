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

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { use, useCallback, useState } from "react"
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
import {
	Calendar,
	CheckCircle,
	Clock,
	Eye,
	Filter,
	Mail,
	MapPin,
	MoreVertical,
	Phone,
	RotateCcw,
	ThumbsDown,
	ThumbsUp
} from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getCommonPinningStyles } from "@/lib/data-table"
import { columns } from "./columns"
import { getPendingFarmersUseCase } from "@/use-cases/farmers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import Image from "next/image"
import { FarmerApprovalBadge } from "../../_components/badges"
import { format } from "date-fns"

interface DataTableProps {
	data: Promise<Awaited<ReturnType<typeof getPendingFarmersUseCase>>>
}

export function DataTable({ data }: DataTableProps) {
	const pendingfarmers = use(data)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const table = useReactTable({
		data: pendingfarmers,
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
															.getColumn("email verification")
															?.getFilterValue() as string[]
													)?.includes(status)}
													onCheckedChange={(checked) => {
														if (checked) {
															table
																.getColumn("email verification")
																?.setFilterValue((old: string[]) => [
																	...(old || []),
																	status
																])
														} else {
															table
																.getColumn("email verification")
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
									<VerificationBadge email verification={row.getValue("email verification")} />
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
			{/* Mobile View */}
			<div className="space-y-4 md:hidden">
				{pendingfarmers.map((farmer) => (
					<Card key={farmer.user.email} className="overflow-hidden">
						<CardHeader className="border-b bg-muted/40 p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<CardTitle className="text-base font-medium">
										{farmer.user.name}
									</CardTitle>
									{farmer.user.isEmailVerified && (
										<CheckCircle className="h-4 w-4 text-green-500" />
									)}
								</div>
								<div className="flex items-center gap-2">
									{/* <Badge variant="secondary">{farmer.applicationStatus}</Badge> */}
									<FarmerApprovalBadge status={farmer!.applicationStatus!} />
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<ThumbsUp className="mr-2 h-4 w-4" />
												Approve
											</DropdownMenuItem>
											<DropdownMenuItem className="text-destructive">
												<ThumbsDown className="mr-2 h-4 w-4" />
												Reject
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4 p-4">
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.user.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										{farmer.birthDate
											? format(new Date(farmer.birthDate), "MMM d yyyy")
											: ""}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{farmer.contactNumber}</span>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										{farmer.address[0].fullAddress
											? farmer.address[0].fullAddress
											: "N/A"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										Applied:
									</span>
									<span className="text-sm">
										{format(new Date(farmer.user.createdAt), "MMM d yyyy")}
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">
										Verification Document
									</span>
									<Dialog>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												<Eye className="mr-2 h-4 w-4" />
												View
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-2xl">
											<DialogHeader>
												<DialogTitle>Verification Document</DialogTitle>
											</DialogHeader>
											<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
												<Image
													src={farmer.verificationDocument!.image!.url!}
													alt="Verification document"
													fill
													className="object-cover"
												/>
											</div>
										</DialogContent>
									</Dialog>
								</div>
								<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
									<Image
										src={farmer.verificationDocument!.image!.url!}
										alt="Verification document thumbnail"
										fill
										className="object-cover"
									/>
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
