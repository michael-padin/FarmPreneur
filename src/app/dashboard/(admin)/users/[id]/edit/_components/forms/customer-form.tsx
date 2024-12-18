"use client"

import { FPAddressPicker } from "@/components/fp/fp-address-picker"
import { FPPhoneInput } from "@/components/fp/fp-phone-input"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
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
import { showErrorToast } from "@/lib/handle-error"
import { getUserByIdUseCase } from "@/use-cases/users"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateCustomer } from "../../actions"
import { editUserSchema, EditUserSchema } from "../../validations"
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
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
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
											<FPPhoneInput
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
											<FPAddressPicker
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
				</form>
			</Form>
		</>
	)
}
