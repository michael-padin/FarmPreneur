"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { FGPasswordInput } from "@/components/fg/fg-password-input"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterFarmerSchema, RegisterFarmerType } from "../types"
import { registerFarmer } from "../action"
import { Popover } from "@/components/ui/popover"
import { DateTimeInput } from "@/components/ui/date-time-input"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"

const RegisterFarmerForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<RegisterFarmerType>({
		resolver: zodResolver(RegisterFarmerSchema),
		defaultValues: {
			email: "",
			birthDate: undefined,
			firstName: "",
			lastName: "",
			contactNumber: "+63",
			address: {
				fullAddress: "",
				street: "",
				region: "",
				country: "",
				postalCode: "",
				latitude: -74.006,
				longitude: 40.7128
			},
			password: "",
			confirmPassword: ""
		}
	})

	const onSubmit = async (data: RegisterFarmerType) => {
		// toast.success("Registering farmer...", {
		// 	description: (
		// 		<>
		// 			<pre>{JSON.stringify(data, null, 2)}</pre>
		// 		</>
		// 	)
		// })
		startTransition(() => {
			registerFarmer(data).then((res) => {
				if (res.error) {
					toast.error(res.error)
				} else {
					router.push(`/verify/${res.data?.userId}`)
				}
			})
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset disabled={isPending} className="space-y-3">
					<div className="flex gap-3">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="John" autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input placeholder="Doe" {...field} autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="@email.com"
										{...field}
										autoComplete="off"
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
						name="birthDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Birth Date</FormLabel>
								<Popover>
									<FormControl>
										<DateTimePicker
											value={field.value}
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
								</Popover>
								<FormMessage />
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
									<AddressLocationPicker
										onAddressSelect={(address) => {
											field.onChange(address)
										}}
										defaultCenter={{
											lng: field.value.longitude,
											lat: field.value.latitude
										}}
										defaultValue={field.value.fullAddress}
										showMap
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<FGPasswordInput {...field} autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<FGPasswordInput {...field} autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full"
						disabled={!form.formState.isDirty}
					>
						{isPending ? (
							<Loader2 className="animate-spin" />
						) : (
							"Create farmer account"
						)}
					</Button>
				</fieldset>
			</form>
		</Form>
	)
}

export default RegisterFarmerForm
