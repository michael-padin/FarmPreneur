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
import { registerFarmerSchema, RegisterFarmerSchema } from "../types"
import { registerFarmer } from "../action"
import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { documentLabels, documentOptions } from "@/types/verificationDocument"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"

const RegisterFarmerForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<RegisterFarmerSchema>({
		resolver: zodResolver(registerFarmerSchema),
		defaultValues: {
			email: "",
			birthDate: "",
			firstName: "",
			lastName: "",
			contactNumber: "+639",
			address: {
				fullAddress: "",
				street: "",
				region: "",
				country: "",
				postalCode: "",
				latitude: -74.006,
				longitude: 40.7128
			},
			documentVerification: {
				image: {},
				type: undefined
			},

			password: "",
			confirmPassword: ""
		}
	})

	const onSubmit = (data: RegisterFarmerSchema) => {
		startTransition(async () => {
			const { error } = await registerFarmer(data)
			if (error) {
				toast.error(error)
				return
			}
			router.push("/verify-email")
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset disabled={isPending} className="space-y-4">
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
										placeholder="johndoe@gmail.com"
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
								<FormControl>
									<Input type="date" {...field} placeholder="MM/DD/YYYY" />
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

					<Separator className="my-4" />
					<CardTitle>Document Verification</CardTitle>
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
											<SelectValue placeholder="Select a document type" />
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
									<FileUpload {...field} maxFiles={1} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Separator className="my-4" />

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
