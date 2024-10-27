"use client"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { FarmerApproval, ROLE } from "@prisma/client"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
import { getUserByIdUseCase } from "@/use-cases/users"

const formSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email({ message: "Invalid email address." }),
	contactNumber: z
		.string()
		.min(10, { message: "Contact number must be at least 10 digits." }),
	role: z.string(),
	farmerApproval: z.nativeEnum(FarmerApproval),
	farmName: z
		.string()
		.min(2, { message: "Farm name must be at least 2 characters." }),
	farmDescription: z
		.string()
		.min(10, { message: "Farm description must be at least 10 characters." }),
	farmLocation: z
		.string()
		.min(2, { message: "Farm location must be at least 2 characters." }),
	farmSize: z
		.number()
		.min(1, { message: "Farm size must be at least 1 acre." }),
	farmProducts: z
		.string()
		.min(2, { message: "Please enter at least one product." }),
	fullAddress: z.string()
})
interface UserDetailsFormProps {
	user: Awaited<ReturnType<typeof getUserByIdUseCase>>
}

export default function UserDetailsForm({ user }: UserDetailsFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {}
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
	}

	return (
		<div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
			<Card className="mx-auto w-full max-w-4xl">
				<CardHeader>
					<CardTitle className="text-3xl font-bold">User Profile</CardTitle>
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
								</div>
								<FormField
									control={form.control}
									name="fullAddress"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address</FormLabel>
											<FormControl>
												<AddressInput
													defaultCenter={{ lat: 40.7128, lng: -74.006 }}
													mapClassName="aspect-square "
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
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

							<Separator className="my-8" />

							<div className="space-y-6">
								<h3 className="text-lg font-semibold">Farm Details</h3>

								<FormField
									control={form.control}
									name="farmerApproval"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Farmer Approval</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Approve farmer registration">
															{field.value && (
																<FarmerApprovalBadge status={field.value} />
															)}
														</SelectValue>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.values(FarmerApproval).map((status) => (
														<SelectItem key={status} value={status}>
															<div className="flex w-full items-center justify-between">
																<FarmerApprovalBadge status={status} />
															</div>
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
									name="farmName"
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
									name="farmDescription"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Farm Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe your farm..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<FormField
										control={form.control}
										name="farmSize"
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
								</div>
								<FormField
									control={form.control}
									name="farmProducts"
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

							<Button type="submit" className="w-full">
								Save Changes
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
