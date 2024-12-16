"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { FPDatePickerWithDropdown } from "@/components/fg/date-picker/fp-date-picker-with-dropdown"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
import { FPMediaUploader } from "@/components/fp/fb-media-uploader"
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateFarmerProfile } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { MediaFile } from "@/types/media"
import { processMediaUpdate } from "@/utils/media"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { EditFarmerProfileSchema, editFarmerProfileSchema } from "../validation"

interface EditFarmerProfileFormProps {
	farmerProfile: {
		userId: string
		email: string
		birthDate: string | Date
		contactNumber: string
		farmName: string
		gender: string
		coverPhoto: MediaFile | null
		profilePicture: MediaFile | null
	}
}

export default function EditFarmerProfileForm({
	farmerProfile
}: EditFarmerProfileFormProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<EditFarmerProfileSchema>({
		resolver: zodResolver(editFarmerProfileSchema),
		defaultValues: {
			farmerName: farmerProfile.farmName,
			birthDate: farmerProfile.birthDate as Date,
			email: farmerProfile.email,
			gender: (farmerProfile.gender ||
				"MALE") as EditFarmerProfileSchema["gender"],
			contactNumber: farmerProfile.contactNumber || "+639",
			coverPhoto: farmerProfile.coverPhoto as MediaFile,
			profilePicture: farmerProfile.profilePicture as MediaFile
		}
	})

	const onSubmit = (values: EditFarmerProfileSchema) => {
		startTransition(async () => {
			const finalCoverPhoto = await processMediaUpdate({
				currentFiles: farmerProfile.coverPhoto,
				newFiles: values.coverPhoto,
				userId: farmerProfile.userId,
				path: "cover-photos"
			})

			const finalProfilePicture = await processMediaUpdate({
				currentFiles: farmerProfile.profilePicture,
				newFiles: values.profilePicture,
				userId: farmerProfile.userId,
				path: "profile-pictures"
			})

			const { error } = await updateFarmerProfile({
				...values,
				newCoverPhoto: finalCoverPhoto?.[0]?.url || "",
				newProfilePicture: finalProfilePicture?.[0]?.url || ""
			})

			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Profile updated successfully", {
				position: "top-right"
			})
			router.push("/dashboard/farmer/profile")
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="coverPhoto"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cover Photo</FormLabel>
							<FormControl>
								<FPMediaUploader
									onChange={field.onChange}
									maxFiles={1}
									singleImage
									mediaClassName="w-full aspect-video object-cover rounded-lg"
									initialMedia={farmerProfile.coverPhoto}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="profilePicture"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Profile Picture</FormLabel>
							<FormControl>
								<FPMediaUploader
									className="w-auto"
									onChange={field.onChange}
									maxFiles={1}
									imageClassName="h-24 w-24 rounded-full"
									mediaClassName="w-24 h-24  rounded-full"
									singleImage
									initialMedia={farmerProfile.profilePicture}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="farmerName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Farm Name or Farmer Name</FormLabel>
							<FormControl>
								<Input placeholder="Mokie's Farmer Or Mokie " {...field} />
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
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Email" type="email" {...field} />
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
					name="gender"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Gender</FormLabel>

							<Select onValueChange={field.onChange} value={field.value!}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="MALE">Male</SelectItem>
									<SelectItem value="FEMALE">Female</SelectItem>
									<SelectItem value="OTHER">Other</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full"
					disabled={isPending || !form.formState.isDirty}
				>
					{isPending ? "Updating..." : "Update"}
				</Button>
			</form>
		</Form>
	)
}
