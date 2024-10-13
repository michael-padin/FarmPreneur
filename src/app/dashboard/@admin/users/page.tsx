"use client"

import * as React from "react"
import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, Check, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for demonstration
const users = Array.from({ length: 50 }, (_, i) => ({
	id: `${i + 1}`,
	name: `User ${i + 1}`,
	email: `user${i + 1}@example.com`,
	role: ["FARMER", "BUYER", "ADMIN"][Math.floor(Math.random() * 3)],
	isSellerApproved: Math.random() > 0.5,
	isVerified: Math.random() > 0.3,
	createdAt: new Date(
		Date.now() - Math.floor(Math.random() * 10000000000)
	).toISOString()
}))

type SortKey = "name" | "email" | "role" | "createdAt"

const ITEMS_PER_PAGE = 10

export default function UserTable() {
	const [sortKey, setSortKey] = useState<SortKey>("name")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
	const [search, setSearch] = useState("")
	const [roleFilter, setRoleFilter] = useState<string[]>([])
	const [verificationFilter, setVerificationFilter] = useState<string[]>([])
	const [sellerApprovalFilter, setSellerApprovalFilter] = useState<string[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [visibleColumns, setVisibleColumns] = useState<string[]>([
		"name",
		"email",
		"role",
		"verification",
		"sellerApproval",
		"createdAt"
	])

	const filteredUsers = users
		.filter(
			(user) =>
				user.name.toLowerCase().includes(search.toLowerCase()) ||
				user.email.toLowerCase().includes(search.toLowerCase())
		)
		.filter((user) => roleFilter.length === 0 || roleFilter.includes(user.role))
		.filter(
			(user) =>
				verificationFilter.length === 0 ||
				verificationFilter.includes(user.isVerified ? "verified" : "unverified")
		)
		.filter(
			(user) =>
				sellerApprovalFilter.length === 0 ||
				(user.role === "FARMER" &&
					sellerApprovalFilter.includes(
						user.isSellerApproved ? "approved" : "pending"
					))
		)

	const sortedUsers = filteredUsers.sort((a, b) => {
		if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1
		if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1
		return 0
	})

	const paginatedUsers = sortedUsers.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	)

	const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE)

	const handleSort = (key: SortKey) => {
		if (key === sortKey) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc")
		} else {
			setSortKey(key)
			setSortOrder("asc")
		}
	}

	const handleSellerApprovalChange = (userId: string, isApproved: boolean) => {
		console.log(
			`${isApproved ? "Approving" : "Revoking approval for"} seller ${userId}`
		)
		// Implement actual seller approval logic here
	}

	const toggleColumnVisibility = (column: string) => {
		setVisibleColumns((current) =>
			current.includes(column)
				? current.filter((c) => c !== column)
				: [...current, column]
		)
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>User Management</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-4 flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
					<Input
						placeholder="Search users..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-sm"
					/>
					<div className="flex space-x-2">
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-8 border-dashed"
								>
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
														checked={roleFilter.includes(role)}
														onCheckedChange={(checked) => {
															setRoleFilter(
																checked
																	? [...roleFilter, role]
																	: roleFilter.filter((r) => r !== role)
															)
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
											{["verified", "unverified"].map((status) => (
												<Label
													key={status}
													className="flex items-center space-x-2 rounded-md border p-2"
												>
													<Checkbox
														id={status}
														checked={verificationFilter.includes(status)}
														onCheckedChange={(checked) => {
															setVerificationFilter(
																checked
																	? [...verificationFilter, status]
																	: verificationFilter.filter(
																			(s) => s !== status
																		)
															)
														}}
													/>
													<span>{status}</span>
												</Label>
											))}
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="sellerApproval">
											Seller Approval Status
										</Label>
										<div className="grid grid-cols-2 gap-2">
											{["approved", "pending"].map((status) => (
												<Label
													key={status}
													className="flex items-center space-x-2 rounded-md border p-2"
												>
													<Checkbox
														id={status}
														checked={sellerApprovalFilter.includes(status)}
														onCheckedChange={(checked) => {
															setSellerApprovalFilter(
																checked
																	? [...sellerApprovalFilter, status]
																	: sellerApprovalFilter.filter(
																			(s) => s !== status
																		)
															)
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
								{[
									"name",
									"email",
									"role",
									"verification",
									"sellerApproval",
									"createdAt"
								].map((column) => (
									<DropdownMenuCheckboxItem
										key={column}
										checked={visibleColumns.includes(column)}
										onCheckedChange={() => toggleColumnVisibility(column)}
									>
										{column}
									</DropdownMenuCheckboxItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<div className="overflow-hidden rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[50px]">ID</TableHead>
								{visibleColumns.includes("name") && (
									<TableHead>
										<Button variant="ghost" onClick={() => handleSort("name")}>
											Name
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
								)}
								{visibleColumns.includes("email") && (
									<TableHead>
										<Button variant="ghost" onClick={() => handleSort("email")}>
											Email
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
								)}
								{visibleColumns.includes("role") && (
									<TableHead>
										<Button variant="ghost" onClick={() => handleSort("role")}>
											Role
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
								)}
								{visibleColumns.includes("verification") && (
									<TableHead>Verification</TableHead>
								)}
								{visibleColumns.includes("sellerApproval") && (
									<TableHead>Seller Approval</TableHead>
								)}
								{visibleColumns.includes("createdAt") && (
									<TableHead>
										<Button
											variant="ghost"
											onClick={() => handleSort("createdAt")}
										>
											Created At
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
								)}
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">{user.id}</TableCell>
									{visibleColumns.includes("name") && (
										<TableCell>{user.name}</TableCell>
									)}
									{visibleColumns.includes("email") && (
										<TableCell>{user.email}</TableCell>
									)}
									{visibleColumns.includes("role") && (
										<TableCell>
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
										</TableCell>
									)}
									{visibleColumns.includes("verification") && (
										<TableCell>
											<Badge
												variant={user.isVerified ? "default" : "destructive"}
											>
												{user.isVerified ? "Verified" : "Unverified"}
											</Badge>
										</TableCell>
									)}
									{visibleColumns.includes("sellerApproval") && (
										<TableCell>
											{user.role === "FARMER" ? (
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															role="combobox"
															className={cn(
																"w-[110px] justify-between",
																!user.isSellerApproved &&
																	"text-muted-foreground"
															)}
														>
															{user.isSellerApproved ? "Approved" : "Pending"}
															<ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-[110px] p-0">
														<Command>
															<CommandInput placeholder="Change status..." />
															<CommandEmpty>No status found.</CommandEmpty>
															<CommandGroup>
																<CommandItem
																	onSelect={() =>
																		handleSellerApprovalChange(user.id, true)
																	}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			user.isSellerApproved
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	Approved
																</CommandItem>
																<CommandItem
																	onSelect={() =>
																		handleSellerApprovalChange(user.id, false)
																	}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			!user.isSellerApproved
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	Pending
																</CommandItem>
															</CommandGroup>
														</Command>
													</PopoverContent>
												</Popover>
											) : (
												<Badge variant="secondary">N/A</Badge>
											)}
										</TableCell>
									)}
									{visibleColumns.includes("createdAt") && (
										<TableCell>
											{new Date(user.createdAt).toLocaleDateString()}
										</TableCell>
									)}
									<TableCell className="text-right">
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
													onClick={() => console.log("View user", user.id)}
												>
													View details
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => console.log("Edit user", user.id)}
												>
													Edit user
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => console.log("Delete user", user.id)}
												>
													Delete user
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="text-sm text-muted-foreground">
						Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
						{Math.min(currentPage * ITEMS_PER_PAGE, sortedUsers.length)} of{" "}
						{sortedUsers.length} entries
					</div>
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
							disabled={currentPage === 1}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setCurrentPage((old) => Math.min(old + 1, totalPages))
							}
							disabled={currentPage === totalPages}
						>
							Next
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
