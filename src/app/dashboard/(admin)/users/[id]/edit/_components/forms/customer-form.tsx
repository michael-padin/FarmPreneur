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
import { useRouter } from "next/navigation"
import UserFormItems from "./user-form-items"

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
								<UserFormItems form={form} />
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
