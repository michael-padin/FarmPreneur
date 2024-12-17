"use client"
import { FPDatePickerWithDropdown } from "@/components/fg/date-picker/fp-date-picker-with-dropdown"
import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
import { FPMediaUploader } from "@/components/fp/fb-media-uploader"
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
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { showErrorToast } from "@/lib/handle-error"
import { getUserByIdUseCase } from "@/use-cases/users"
import { processMediaUpdate } from "@/utils/media"
import { zodResolver } from "@hookform/resolvers/zod"
import { FarmerApplicationStatus, ROLE } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { FarmerApprovalBadge } from "../../../../(lists)/_components/badges"
import { updateFarmer } from "../../actions"
import { editUserSchema, EditUserSchema } from "../../validations"
import UserFormItems from "./user-form-items"

interface FarmerFormProps {
	user: Awaited<ReturnType<typeof getUserByIdUseCase>>
}

export default function FarmerForm({ user }: FarmerFormProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const form = useForm<EditUserSchema>({
		resolver: zodResolver(editUserSchema),
		defaultValues: {
			role: user?.role || "FARMER",
			email: user?.email || "",
			name: user?.name || "",
			password: "",
			isEmailVerified: user?.isEmailVerified || false,
			farmer: {
				applicationStatus: user!.farmer!.applicationStatus!,
				address: {
					country: user.farmer!.address[0].country || "",
					fullAddress: user.farmer!.address[0].fullAddress || "",
					latitude: user.farmer!.address[0].latitude || 0,
					longitude: user.farmer!.address[0].longitude || 0,
					postalCode: user.farmer!.address[0].postalCode || "",
					region: user.farmer!.address[0].region || "",
					street: user.farmer!.address[0].street || ""
				},
				birthDate: user.farmer!.birthDate || new Date(),
				contactNumber: user.farmer!.contactNumber || "",
				farmDescription: user.farmer!.farmDescription || "",
				farmImages:
					user.farmer!.farmImages.length > 0
						? user.farmer!.farmImages.map((image) => ({
								id: Math.random().toString(36).substring(7),
								url: image,
								type: "image" as "image" | "video",
								file: null
							}))
						: [],
				farmName: user.farmer!.farmName || "",
				verificationDocument: {
					image: user.farmer!.verificationDocument!.image
						? {
								id: Math.random().toString(36).substring(7),
								url: user.farmer!.verificationDocument?.image || "",
								type: "image" as "image" | "video",
								file: null
							}
						: null,
					type: user.farmer!.verificationDocument?.type || "VOTER_ID"
				}
			}
		}
	})

	const onSubmit = async (data: EditUserSchema) => {
		startTransition(async () => {
			const finalVerificationDocument = await processMediaUpdate({
				currentFiles: user.farmer!.verificationDocument!.image
					? {
							id: Math.random().toString(36).substring(7),
							url: user.farmer!.verificationDocument?.image || "",
							type: "image" as "image" | "video",
							file: null
						}
					: null,
				newFiles: data.farmer!.verificationDocument.image,
				userId: user?.id || "",
				path: "verification-documents"
			})
			const finalFarmImages = await processMediaUpdate({
				currentFiles:
					user.farmer!.farmImages.length > 0
						? user.farmer!.farmImages.map((image) => ({
								id: Math.random().toString(36).substring(7),
								url: image,
								type: "image" as "image" | "video",
								file: null
							}))
						: [],
				newFiles: data.farmer!.farmImages,
				userId: user?.id || "",
				path: "farm-images"
			})
			const { error } = await updateFarmer({
				...data,
				farmer: {
					...data.farmer!,
					verificationDocument: {
						...data.farmer!.verificationDocument,
						image: finalVerificationDocument[0]
					}
				},
				userId: user!.id
			})

			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Farmer updated successfully!", {
				position: "top-right"
			})
			router.refresh()
			router.push("/dashboard/users/farmers")
		})
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card>
					<CardHeader>
						<CardTitle>Edit Farmer</CardTitle>
						<CardDescription>Edit farmer details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<UserFormItems form={form} />
						<FormField
							control={form.control}
							name="farmer.applicationStatus"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Application Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value as ROLE}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select Status">
													{field.value && (
														<FarmerApprovalBadge status={field.value} />
													)}
												</SelectValue>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.values(FarmerApplicationStatus).map((status) => (
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
							name="farmer.birthDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Birth Date</FormLabel>
									<FPDatePickerWithDropdown {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="farmer.contactNumber"
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
							name="farmer.address"
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

						<FormField
							control={form.control}
							name="farmer.farmName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Farm Name</FormLabel>
									<FormControl>
										<Input placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="farmer.farmDescription"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Farm Description</FormLabel>
									<FormControl>
										<Input placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="farmer.farmImages"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Farm Images</FormLabel>
									<FormControl>
										<FPMediaUploader
											{...field}
											onChange={field.onChange}
											singleImage
											initialMedia={
												user.farmer!.farmImages.length > 0
													? user.farmer!.farmImages.map((image) => ({
															id: Math.random().toString(36).substring(7),
															url: image,
															type: "image" as "image" | "video",
															file: null
														}))
													: []
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="farmer.verificationDocument.image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Document</FormLabel>
									<FormControl>
										<FPMediaUploader
											{...field}
											onChange={field.onChange}
											singleImage
											initialMedia={
												user.farmer!.verificationDocument!.image
													? {
															id: Math.random().toString(36).substring(7),
															url:
																user.farmer!.verificationDocument?.image || "",
															type: "image" as "image" | "video",
															file: null
														}
													: []
											}
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
	)
}
