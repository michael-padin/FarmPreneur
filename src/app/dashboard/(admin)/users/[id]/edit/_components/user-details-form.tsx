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
import { UpdateUserSchema, updateUserSchema } from "../types"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { DateTimeInput } from "@/components/ui/date-time-input"
import { documentOptions } from "@/types/verificationDocument"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { BackButton } from "@/components/fg/back-button"

interface UserDetailsFormProps {
	user: Awaited<ReturnType<typeof getUserByIdUseCase>>
	farmDetails: Awaited<ReturnType<typeof Object>>
}

export default function UserDetailsForm({
	user,
	farmDetails
}: UserDetailsFormProps) {
	const [isUpdatePending, startTransition] = useTransition()
	const form = useForm<UpdateUserSchema>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			contactNumber: "+639",
			email: user?.email || "",
			name: user?.name || "",
			role: user?.role || "CUSTOMER",
			farmerApplicationStatus: null,
			birthDate: null,
			profilePicture: user?.profilePicture || null,
			documentVerification: {},
			farmDetails: (farmDetails as UpdateUserSchema["farmDetails"]) || null,
			address: {}
		}
	})

	const userRole = form.watch("role")

	const onSubmit = (data: UpdateUserSchema) => {
		toast.success("Success", { description: <pre>{JSON.stringify(data)}</pre> })
		startTransition(() => {})
	}

	return (
		<>
			{/* <div className="container mx-auto space-y-2 px-4 py-5 sm:px-6 lg:px-8">
			<BackButton />
			<Card>
				<CardHeader>
					<CardTitle className="">User Details</CardTitle>
					<CardDescription>
						View and update your profile information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="mb-8 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
								<Avatar className="h-24 w-24">
									<AvatarImage
										src={form.watch("profilePicture.url")}
										alt="User Avatar"
									/>
									<AvatarFallback>
										{form.watch("name").charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="space-y-2 text-center sm:text-left">
									<h2 className="text-2xl font-bold">{form.watch("name")}</h2>
									<p className="text-muted-foreground">{form.watch("email")}</p>
									<RoleBadge
										role={form.watch("role")}
										className="mx-auto w-max lg:mx-0"
									/>
								</div>
							</div>

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

							{userRole === "FARMER" && (
								<FormField
									control={form.control}
									name="farmerApplicationStatus"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Farmer Application Status</FormLabel>
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
							)}

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
									name="profilePicture"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Profile Picture</FormLabel>
											<FormControl>
												<FileUpload
													path="profile-pictures"
													value={field.value!}
													onChange={(value) => field.onChange(value)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="birthDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Birth Date</FormLabel>
											<FormControl>
												<DateTimePicker
													value={field.value!}
													onChange={field.onChange}
													hideTime
													renderTrigger={({ open, value, setOpen }) => (
														<DateTimeInput
															value={value}
															onChange={(x) => !open && field.onChange(x)}
															format="MM/dd/yyyy"
															disabled={open}
															onCalendarClick={() => setOpen(!open)}
														/>
													)}
												/>
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
												<FGSinglePhoneINput
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel></FormLabel>
											<FormControl>
												<AddressLocationPicker
													defaultCenter={{
														lat: field?.value?.latitude || 40.7128,
														lng: field?.value?.longitude || -74.006
													}}
													onAddressSelect={field.onChange}
													defaultValue={field?.value?.fullAddress}
													showMap
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							{user?.verificationDocument && (
								<>
									<Separator className="my-8" />
									<div className="space-y-6">
										<h3 className="text-2xl font-semibold leading-none tracking-tight">
											Verification Document
										</h3>
										<FormField
											control={form.control}
											name="documentVerification.type"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Document Type</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue>{field.value}</SelectValue>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{documentOptions.map((doc) => (
																<SelectItem value={doc.value} key={doc.value}>
																	{doc.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="documentVerification.image"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Image</FormLabel>
													<FormControl>
														<FileUpload {...field} path="documents" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</>
							)}

							{userRole === "FARMER" && (
								<>
									<Separator className="my-8" />
									<div className="space-y-6">
										<h3 className="text-2xl font-semibold leading-none tracking-tight">
											Farm Details
										</h3>

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
										<FormField
											control={form.control}
											name="farmDetails.images"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Farm Images</FormLabel>
													<FormControl>
														<FileUpload
															multiple
															{...field}
															maxFiles={10}
															path={`farm-images`}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

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
		</div> */}
		</>
	)
}
