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
			password: ""
		})
	}, [user, form])

	const onSubmit = async (data: UpdateUserTypes) => {
		startUpdateTransition(() => {
			updateUser({
				id: user.id,
				...data
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
			<SheetContent className="flex w-full flex-col gap-6 overflow-y-scroll sm:max-w-md">
				<SheetHeader>
					<SheetTitle>Edit User</SheetTitle>
					<SheetDescription>
						Make changes to the user profile here. Click save when you&apos;re
						done.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<fieldset
							className="flex flex-col gap-4"
							disabled={isUpdatePending}
						>
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
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Verified</FormLabel>
											<FormDescription>Is this user verified?</FormDescription>
										</div>
									</FormItem>
								)}
							/>
							<SheetFooter className="gap-2 pt-2 sm:space-x-0">
								<SheetClose asChild>
									<Button type="button" variant="outline">
										Cancel
									</Button>
								</SheetClose>
								<Button disabled={isUpdatePending}>
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
