"use client"
import React, { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import AddressInput from "@/components/fg/fg-map-box-location-picker"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	FarmerApprovalBadge,
	RoleBadge
} from "../../../(lists)/_components/badges"
import { FarmerApplicationStatus, ROLE } from "@prisma/client"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
import { getUserByIdUseCase } from "@/use-cases/users"
import { UpdateUser, updateUserFormSchema } from "../types"
import { getFarmDetailsByUserIdUseCase } from "@/use-cases/farm-details"

interface UserDetailsFormProps {
	user: Awaited<ReturnType<typeof getUserByIdUseCase>>
	farmDetails: Awaited<ReturnType<typeof getFarmDetailsByUserIdUseCase>>
}

export default function UserDetailsForm({
	user,
	farmDetails
}: UserDetailsFormProps) {
	const [isUpdatePending, startTransition] = useTransition()
	const form = useForm<UpdateUser>({
		resolver: zodResolver(updateUserFormSchema),
		defaultValues: {
			contactNumber: user?.contactNumber || "+639",
			email: user?.email || "",
			name: user?.name || "",
			role: user?.role || "CUSTOMER",
			farmerApplicationStatus: user?.farmerApplicationStatus || null,
			farmDetails: {
				farmDescription: farmDetails?.farmDescription || "",
				images: farmDetails?.images || [],
				address: {
					fullAddress: farmDetails?.address?.fullAddress || "",
					street: farmDetails?.address?.street || "",
					region: farmDetails?.address?.region || "",
					country: farmDetails?.address?.country || "",
					postalCode: farmDetails?.address?.postalCode || "",
					latitude: farmDetails?.address?.latitude || 0
				},
				farmName: farmDetails?.farmName || "",
				products: farmDetails?.products || []
			},
			address: {
				fullAddress: user?.address?.fullAddress || "",
				street: user?.address?.street || "",
				region: user?.address?.region || "",
				country: user?.address?.country || "",
				postalCode: user?.address?.postalCode || "",
				latitude: user?.address?.latitude || 0,
				longitude: user?.address?.longitude || 0
			}
		}
	})

	const userRole = form.watch("role")

	const onSubmit = (data: UpdateUser) => {
		startTransition(() => {})
	}

	return (
		<div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
			<Card className="mx-auto w-full max-w-4xl">
				<CardHeader>
					<CardTitle className="">User Profile</CardTitle>
					<CardDescription>
						View and update your profile information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							{/* <div className="mb-8 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
								<Avatar className="h-24 w-24">
									<AvatarImage
										src="/placeholder.svg?height=96&width=96"
										alt="User Avatar"
									/>
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
								<div className="text-center sm:text-left">
									<h2 className="text-2xl font-bold">{form.watch("name")}</h2>
									<p className="text-muted-foreground">{form.watch("email")}</p>
									<Badge variant="secondary" className="mt-2">
										Verified
									</Badge>
								</div>
							</div> */}

							{/* <Separator className="my-8" /> */}

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="space-y-6">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="John Doe" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="john@example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="contactNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Contact Number</FormLabel>
												<FormControl>
													<FGSinglePhoneINput {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="role"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Role</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select a role">
																{field.value && (
																	<RoleBadge role={field.value as ROLE} />
																)}
															</SelectValue>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.values(ROLE).map((role) => (
															<SelectItem key={role} value={role}>
																<div className="flex w-full items-center justify-between">
																	<RoleBadge role={role} />
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>address</FormLabel>
											<FormControl>
												<AddressInput
													defaultCenter={{
														lat: user?.address?.latitude || 40.7128,
														lng: user?.address?.longitude || -74.006
													}}
													mapClassName="aspect-square "
													onAddressSelect={(address) => {
														form.setValue("address", address, {
															shouldValidate: true
														})
													}}
													defaultValue={user?.address?.fullAddress || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{userRole === "FARMER" && (
								<>
									<Separator className="my-8" />
									<div className="space-y-6">
										<h3 className="text-2xl font-semibold leading-none tracking-tight">
											Farm Details
										</h3>
										<FormField
											control={form.control}
											name="farmerApplicationStatus"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Application Status</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value as ROLE}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select Status">
																	{field.value && (
																		<FarmerApprovalBadge status={field.value} />
																	)}
																</SelectValue>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Object.values(FarmerApplicationStatus).map(
																(status) => (
																	<SelectItem key={status} value={status}>
																		<div className="flex w-full items-center justify-between">
																			<FarmerApprovalBadge status={status} />
																		</div>
																	</SelectItem>
																)
															)}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="farmDetails.farmName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Farm Name</FormLabel>
													<FormControl>
														<Input placeholder="Green Acres Farm" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="farmDetails.farmDescription"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Farm Description</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Describe your farmDetails..."
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											<FormField
												control={form.control}
												name="farmDetails.size"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Farm Size (acres)</FormLabel>
														<FormControl>
															<Input
																type="number"
																{...field}
																onChange={(e) =>
																	field.onChange(parseInt(e.target.value))
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div> */}
										<FormField
											control={form.control}
											name="farmDetails.products"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Farm Products</FormLabel>
													<FormControl>
														<Input
															placeholder="Tomatoes, Lettuce, Carrots..."
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Enter products separated by commas
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</>
							)}
							<Button
								type="submit"
								className="w-full"
								disabled={isUpdatePending || !form.formState.isDirty}
							>
								Save Changes
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
