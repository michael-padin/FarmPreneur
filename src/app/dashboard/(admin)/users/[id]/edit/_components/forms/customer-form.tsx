"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { getUserByIdUseCase } from "@/use-cases/users"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { editUserSchema, EditUserSchema } from "../validations"
import { BackButton } from "@/components/fg/back-button"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { RoleBadge } from "../../../../(lists)/_components/badges"
import { ROLE } from "@prisma/client"
import { Input } from "@/components/ui/input"
import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
import { useTransition } from "react"
import { showErrorToast } from "@/lib/handle-error"
import { toast } from "sonner"
import { updateCustomer } from "../../actions"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

interface CustomerFormProps {
	user: Awaited<ReturnType<typeof getUserByIdUseCase>>
}

export default function CustomerForm({ user }: CustomerFormProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<EditUserSchema>({
		resolver: zodResolver(editUserSchema),
		defaultValues: {
			customer: (user?.customer as EditUserSchema["customer"]) || null,
			role: user?.role || "CUSTOMER",
			email: user?.email || "",
			name: user?.name || "",
			password: "",
			isEmailVerified: user?.isEmailVerified || false,
			farmer: null
		}
	})

	const onSubmit = async (data: EditUserSchema) => {
		startTransition(async () => {
			const { error } = await updateCustomer({
				...data,
				userId: user!.id
			})

			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Customer updated successfully!")
			router.refresh()
			router.push("/dashboard/users")
		})
	}
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="mt-5 space-y-2 lg:container lg:mt-10">
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<BackButton
										type="button"
										variant="secondary"
										className="rounded-full"
									/>
									<div>
										<CardTitle>Edit Customer</CardTitle>
										<CardDescription>Edit customer details</CardDescription>
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-6">
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
									name="isEmailVerified"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel>Email Verified</FormLabel>
												<FormDescription>
													Indicate if this email has been verified.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="customer.contactNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Contact Number</FormLabel>
											<FormControl>
												<FGSinglePhoneINput
													placeholder="1234567890"
													{...field}
													value={field.value ? field.value : ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="customer.address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address</FormLabel>
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
								{process.env.NODE_ENV === "development" && (
									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<AccordionTrigger>User Info</AccordionTrigger>
											<AccordionContent>
												<pre>{JSON.stringify(user, null, 2)}</pre>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								)}
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									type="button"
									variant={"secondary"}
									size={"lg"}
									onClick={() => router.back()}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={!form.formState.isDirty}
									size={"lg"}
								>
									{isPending ? "Saving..." : "Save"}
								</Button>
							</CardFooter>
						</Card>
					</div>
				</form>
			</Form>
		</>
	)
}
