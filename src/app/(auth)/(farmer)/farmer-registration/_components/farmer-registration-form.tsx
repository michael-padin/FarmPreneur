"use client"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"

import { FPPhoneInput } from "@/components/fp/fp-phone-input"
import { Separator } from "@/components/ui/separator"
import { showErrorToast } from "@/lib/handle-error"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { upsertFarmerAction } from "../actions"
import { farmRegistrationSchema, FarmRegistrationSchema } from "../types"

import { FPDatePickerWithDropdown } from "@/components/fp/date-picker/fp-date-picker-with-dropdown"
import { FPAddressPicker } from "@/components/fp/fp-address-picker"
import { FPMediaUploader } from "@/components/fp/fp-media-uploader"
import { FPSelect } from "@/components/fp/fp-select"
import { FPSignOutButton } from "@/components/fp/fp-signout-button"
import { CardTitle } from "@/components/ui/card"
import { verificationDocumentTypes } from "@/constants/verification-document"
import { processMediaUpdate } from "@/utils/media"

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
				fullAddress: user?.farmer?.address?.[0].fullAddress || "",
				street: user?.farmer?.address?.[0].street || "",
				region: user?.farmer?.address?.[0].region || "",
				country: user?.farmer?.address?.[0].country || "",
				postalCode: user?.farmer?.address?.[0].postalCode || "",
				latitude: user?.farmer?.address?.[0].latitude || 0,
				longitude: user?.farmer?.address?.[0].longitude || 0
			},
			user: {
				name: user?.name || "",
				email: user?.email || ""
			},
			govIdImage: {
				id: Math.random().toString(36).substring(7),
				url: user?.farmer?.govIdImage || "",
				type: "image" as "image" | "video",
				file: null
			},
			selfieWithGovIdImage: {
				id: Math.random().toString(36).substring(7),
				url: user?.farmer?.selfieWithGovIdImage || "",
				type: "image" as "image" | "video",
				file: null
			},
			farmImages: [],
			farmDescription: user?.farmer?.farmDescription || "",
			farmName: user?.farmer?.farmName || "",
			birthDate: user?.farmer?.birthDate || undefined
		}
	})

	const onSubmit = async (data: FarmRegistrationSchema) => {
		startTransition(async () => {
			const finalGovIdImage = await processMediaUpdate({
				currentFiles: user?.farmer?.govIdImage
					? {
							id: Math.random().toString(36).substring(7),
							url: user?.farmer?.govIdImage || "",
							type: "image" as "image" | "video",
							file: null
						}
					: null,
				newFiles: data.govIdImage,
				userId: user?.id || "",
				path: "verification-documents"
			})

			const finalSelfieWithGovIdImage = await processMediaUpdate({
				currentFiles: user?.farmer?.selfieWithGovIdImage
					? {
							id: Math.random().toString(36).substring(7),
							url: user?.farmer?.selfieWithGovIdImage || "",
							type: "image" as "image" | "video",
							file: null
						}
					: null,
				newFiles: data.selfieWithGovIdImage,
				userId: user?.id || "",
				path: "selfie-with-gov-id-images"
			})
			const finalFarmImages = await processMediaUpdate({
				currentFiles:
					user?.farmer?.farmImages && user?.farmer?.farmImages?.length > 0
						? user?.farmer?.farmImages.map((image) => ({
								id: Math.random().toString(36).substring(7),
								url: image,
								type: "image" as "image" | "video",
								file: null
							}))
						: [],
				newFiles: data.farmImages,
				userId: user?.id || "",
				path: "farm-images"
			})

			const { error } = await upsertFarmerAction({
				...data,
				userId: user!.id,
				newGovIdImage: finalGovIdImage?.[0]?.url || "",
				newSelfieWithGovIdImage: finalSelfieWithGovIdImage?.[0]?.url || "",
				farmImages: finalFarmImages
			})
			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Successfully created farmer details")
			router.push("/dashboard/farmer/application-status")
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
								<FormDescription>
									Enter your full legal name as it appears on official
									documents. This will be used to identify you on the platform.
								</FormDescription>
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
									<FPDatePickerWithDropdown
										{...field}
										value={field.value && field.value}
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
									<FPPhoneInput {...field} />
								</FormControl>
								<FormDescription>
									Enter your active phone number. This will be used for account
									recovery and important alerts.
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
									<Input placeholder="" {...field} />
								</FormControl>
								<FormDescription>
									Enter the name of your farm (if applicable). This will appear
									in your profile and help customers recognize your farm.
								</FormDescription>
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
									<Input placeholder="" {...field} />
								</FormControl>
								<FormDescription>
									Share details about your farm, such as the size, type, or the
									main crops you produce.
								</FormDescription>
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
									<FPAddressPicker
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
									Enter your farm address accurately, as it will be used as the
									pickup location for customers.{" "}
								</FormDescription>
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
									<FPMediaUploader
										{...field}
										initialMedia={[]}
										maxFiles={5}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormDescription>
									Upload clear images of your farm to showcase your operations
									and build trust with customers.{" "}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Separator className="my-8" />
					<CardTitle>Document Verification</CardTitle>
					<div className="space-y-6">
						<FormField
							control={form.control}
							name="govIdType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Government ID Type</FormLabel>
									<FPSelect
										{...field}
										items={verificationDocumentTypes}
										placeholder="Select type"
									/>
									<FormDescription>
										Select the type of government ID you will upload for
										verification (e.g., National ID, Driver’s License,
										Passport).
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="govIdImage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Upload Government ID </FormLabel>
									<FormControl>
										<FPMediaUploader
											{...field}
											initialMedia={[]}
											onChange={field.onChange}
											singleImage
											maxFiles={1}
											imageClassName="w-full h-48 object-contain"
											mediaClassName="w-full h-48 object-contain"
										/>
									</FormControl>
									<FormDescription>
										Upload a clear image or scan of your government-issued ID.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="selfieWithGovIdImage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Selfie with Government ID</FormLabel>
									<FormControl>
										<FPMediaUploader
											{...field}
											initialMedia={[]}
											onChange={field.onChange}
											singleImage
											maxFiles={1}
											imageClassName="w-full h-48 object-contain"
											mediaClassName="w-full h-48 object-contain"
										/>
									</FormControl>
									<FormDescription>
										Take a selfie holding your ID. This is for verification
										purposes.
									</FormDescription>
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
			<Button asChild variant="secondary" className="mt-2 w-full">
				<FPSignOutButton text="Cancel" />
			</Button>
		</Form>
	)
}
