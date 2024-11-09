"use client"
import { useTransition } from "react"
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

import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { showErrorToast } from "@/lib/handle-error"
import { farmRegistrationSchema, FarmRegistrationSchema } from "../types"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { upsertFarmerAction } from "../actions"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
import { Separator } from "@/components/ui/separator"

import { CardTitle } from "@/components/ui/card"
import { FPDocumentSelect } from "@/components/fg/fp-document-select"

interface FarmRegistrationFormProps {
	user: Awaited<ReturnType<typeof getUserFarmerByIdUseCase>>
}

export const FarmRegistrationForm = ({ user }: FarmRegistrationFormProps) => {
	const router = useRouter()
	const [isUpdatePending, startTransition] = useTransition()
	const form = useForm<FarmRegistrationSchema>({
		resolver: zodResolver(farmRegistrationSchema),
		defaultValues: {
			contactNumber: user?.farmer?.contactNumber || "+639",
			address: {
				fullAddress: user?.farmer?.address?.fullAddress || "",
				street: user?.farmer?.address?.street || "",
				region: user?.farmer?.address?.region || "",
				country: user?.farmer?.address?.country || "",
				postalCode: user?.farmer?.address?.postalCode || "",
				latitude: user?.farmer?.address?.latitude || 0,
				longitude: user?.farmer?.address?.longitude || 0
			},
			user: {
				name: user?.name || "",
				email: user?.email || ""
			},
			farmName: user?.farmer?.farmName || "",
			farmDescription: user?.farmer?.farmDescription || "",
			farmImages: [],
			documentVerification: {
				type: user?.farmer?.verificationDocument?.type,
				image: {
					url: user?.farmer?.verificationDocument?.image?.url,
					filename: user?.farmer?.verificationDocument?.image?.filename,
					size: user?.farmer?.verificationDocument?.image?.size
				}
			},
			birthDate: user?.farmer?.birthDate?.toISOString().split("T")[0] || ""
		}
	})

	const onSubmit = async (data: FarmRegistrationSchema) => {
		console.log("user.id :>> ", user?.id)
		startTransition(async () => {
			const { error } = await upsertFarmerAction({
				...data,
				userId: user!.id
			})
			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Successfully created farmer details")
			router.push("/dashboard/farmer")
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<fieldset className="space-y-6">
					<FormField
						control={form.control}
						name="user.email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="Green Acres Farm"
										{...field}
										disabled
										readOnly
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="user.name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input placeholder="Green Acres Farm" {...field} />
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
									<Input {...field} type="date" />
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
								<FormDescription>
									Enter your exact farm address or pickup location
								</FormDescription>
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
									<Textarea placeholder="Describe your farm" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="farmImages"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Farm Images</FormLabel>
								<FormControl>
									<FileUpload
										{...field}
										multiple
										path={`farm-images`}
										maxFiles={5}
									/>
								</FormControl>
								<FormDescription>
									Upload up to 5 images of your farm
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* <FormField
						control={form.control}
						name="products"
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
					/> */}

					<Separator className="my-8" />
					<CardTitle>Document Verification</CardTitle>
					<div className="space-y-6">
						<FormField
							control={form.control}
							name="documentVerification.type"
							render={({ field }) => (
								<FormItem>
									<FPDocumentSelect {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="documentVerification.image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Document</FormLabel>
									<FormControl>
										<FileUpload {...field} path={`document-verification`} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</fieldset>
				<Button type="submit" className="w-full" disabled={isUpdatePending}>
					Submit
				</Button>
			</form>
		</Form>
	)
}
