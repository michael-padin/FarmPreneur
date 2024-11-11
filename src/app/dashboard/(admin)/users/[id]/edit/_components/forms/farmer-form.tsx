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
import UserFormItems from "./user-form-items"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BackButton } from "@/components/fg/back-button"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { editUserSchema, EditUserSchema } from "../validations"
import { showErrorToast } from "@/lib/handle-error"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { updateFarmer } from "../../actions"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"
import { S3PATH } from "@/constants/s3-path"
import { FPDatePickerWithDropdown } from "@/components/fg/date-picker/fp-date-picker-with-dropdown"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { FarmerApprovalBadge } from "../../../../(lists)/_components/badges"
import { FarmerApplicationStatus, ROLE } from "@prisma/client"

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
			farmer: (user?.farmer as EditUserSchema["farmer"]) || null
		}
	})

	const onSubmit = async (data: EditUserSchema) => {
		startTransition(async () => {
			const { error } = await updateFarmer({
				...data,
				userId: user!.id
			})

			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Farmer updated successfully!")
			router.refresh()
			router.push("/dashboard/users/farmers")
		})
	}
	return (
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
									<CardTitle>Edit Farmer</CardTitle>
									<CardDescription>Edit farmer details</CardDescription>
								</div>
							</div>
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
												{Object.values(FarmerApplicationStatus).map(
													(status) => (
														<SelectItem key={status} value={status}>
															<div className="flex w-full items-center justify-between">
																<FarmerApprovalBadge status={status} />
															</div>
														</SelectItem>
													)
												)}
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
											<FGSinglePhoneINput
												placeholder="+639343434343"
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
											<FileUpload
												{...field}
												path={S3PATH.FARMIMAGES}
												multiple
												maxFiles={5}
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
											<FileUpload {...field} path={S3PATH.DOCUMENTS} />
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
	)
}
