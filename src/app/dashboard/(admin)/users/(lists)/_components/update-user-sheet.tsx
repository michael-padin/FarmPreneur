"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle
} from "@/components/ui/sheet"

import { FarmerApproval, ROLE } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { useEffect, useTransition } from "react"
import {
	UpdateTaskSheetProps,
	UpdateUserTypes,
	updateUserSchema
} from "../types"
import { Icons } from "@/components/icons"
import { updateUser } from "../actions"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"

import { RoleBadge } from "./badges"
import MapboxLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { resendCode } from "@/app/(auth)/verify/actions"

export function UpdateUserSheet({ user, ...props }: UpdateTaskSheetProps) {
	const [isUpdatePending, startUpdateTransition] = useTransition()

	const form = useForm<UpdateUserTypes>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			name: user.name,
			email: user.email,
			contactNumber: (user.contactNumber as string) || "+639",
			isVerified: user.isVerified,
			image: user.image,
			farmerApproval: user.farmerApproval,
			role: user.role,
			address: user.Address || {
				fullAddress: "",
				street: "",
				region: "",
				country: "",
				postalCode: "",
				latitude: 0,
				longitude: 0,
				locationType: ""
			},
			password: ""
		}
	})

	useEffect(() => {
		form.reset({
			name: user.name,
			email: user.email,
			contactNumber: (user.contactNumber as string) || "+639",
			isVerified: user.isVerified,
			image: user.image,
			farmerApproval: user.farmerApproval,
			role: user.role,
			password: "",
			address: user.Address || {
				fullAddress: "",
				street: "",
				region: "",
				country: "",
				postalCode: "",
				latitude: 0,
				longitude: 0,
				locationType: ""
			}
		})
	}, [user, form])

	const onSubmit = async (data: UpdateUserTypes) => {
		startUpdateTransition(() => {
			updateUser({
				...data,
				address: {
					...data.address,
					userId: user.id,
					id: user.Address?.id || ""
				},
				id: user.id
			}).then(({ error }) => {
				if (error) {
					toast.error(error)
					return
				}
				form.reset()
				props.onOpenChange?.(false)
				toast.success("User updated")
			})
		})
	}

	return (
		<Sheet {...props}>
			<SheetContent className="w-full space-y-6 overflow-y-scroll sm:w-[540px]">
				<SheetHeader>
					<SheetTitle>Edit User</SheetTitle>
					<SheetDescription>
						Make changes to the user profile here. Click save when you&apos;re
						done.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<fieldset className="space-y-4" disabled={isUpdatePending}>
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Profile Image URL</FormLabel>
										<FormControl>
											<Input
												placeholder="https://example.com/image.jpg"
												{...field}
												value={field.value ?? ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												{...field}
												value={field.value ?? ""}
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
											<Input
												placeholder="john@example.com"
												{...field}
												value={field.value ?? ""}
											/>
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
												<SelectTrigger className="w-[200px]">
													<SelectValue placeholder="Select a role">
														{field.value && <RoleBadge role={field.value} />}
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
							{form.getValues("role") === "FARMER" && (
								<FormField
									control={form.control}
									name="farmerApproval"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Farmer Approval</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value ?? undefined}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Approve farmer" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.values(FarmerApproval).map((role) => (
														<SelectItem key={role} value={role}>
															{role}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												type="password"
												placeholder="********"
												{...field}
												value={field.value ?? ""}
											/>
										</FormControl>
										<FormDescription>
											Leave blank to keep the current password
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="isVerified"
								render={({ field }) => (
									<FormItem className="inline-block">
										<FormLabel>Email Verification</FormLabel>
										<FormControl>
											<div className="flex items-center gap-2">
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
													className="h-5 w-5"
												/>
												{/* TODO: Add resend code button */}
												{/* <div className="text-muted-foreground">OR</div>
												<div>
													<Button
														variant="outline"
														size="sm"
														className="ml-2"
														type="button"
														onClick={async () => {
															await resendCode(user.id)
														}}
													>
														Send Email Verification
													</Button>
												</div> */}
											</div>
										</FormControl>
										<FormDescription>
											Is this user verified?
											{/* i want button to send verification email */}
										</FormDescription>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<MapboxLocationPicker
												onAddressSelect={(address) => {
													form.setValue("address", address, {
														shouldValidate: true
													})
												}}
												defaultCenter={{
													lat: user.Address?.latitude || 9.882696,
													lng: user.Address?.longitude || 123.605887
												}} // Optional
												defaultValue={
													user.Address?.fullAddress ||
													"Argao, Cebu, Philippines"
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<SheetFooter className="gap-2 pt-2 sm:space-x-0">
								<SheetClose asChild>
									<Button type="button" variant="outline">
										Cancel
									</Button>
								</SheetClose>
								<Button disabled={isUpdatePending} type="submit">
									{isUpdatePending && (
										<Icons.spinner
											className="mr-2 size-4 animate-spin"
											aria-hidden="true"
										/>
									)}
									Save
								</Button>
							</SheetFooter>
						</fieldset>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
