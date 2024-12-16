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
import { updateCustomerProfile } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { getCustomerProfileUseCase } from "@/use-cases/customers"
import { processMediaUpdate } from "@/utils/media"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import {
	EditCustomerProfileSchema,
	editCustomerProfileSchema
} from "../validation"

export default function EditCustomerProfileForm({
	customerProfile
}: {
	customerProfile: Awaited<ReturnType<typeof getCustomerProfileUseCase>>
}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<EditCustomerProfileSchema>({
		resolver: zodResolver(editCustomerProfileSchema),
		defaultValues: {
			bio: customerProfile.bio,
			profilePicture: customerProfile.profilePicture,
			coverPhoto: customerProfile.coverPhoto,
			fullName: customerProfile.name,
			birthDate: customerProfile.birthDate as Date,
			email: customerProfile.email,
			gender: customerProfile.gender || "MALE",
			contactNumber: customerProfile.contactNumber || "+639"
		}
	})

	const onSubmit = (values: EditCustomerProfileSchema) => {
		startTransition(async () => {
			const finalCoverPhoto = await processMediaUpdate({
				currentFiles: customerProfile.coverPhoto,
				newFiles: values.coverPhoto,
				userId: customerProfile.userId,
				path: "cover-photos"
			})

			const finalProfilePicture = await processMediaUpdate({
				currentFiles: customerProfile.profilePicture,
				newFiles: values.profilePicture,
				userId: customerProfile.userId,
				path: "profile-pictures"
			})
			const { error } = await updateCustomerProfile({
				...values,
				newCoverPhoto: finalCoverPhoto?.[0]?.url || "",
				newProfilePicture: finalProfilePicture?.[0]?.url || ""
			})
			if (error) {
				showErrorToast(error)
			} else {
				toast.success("Profile updated successfully")
				router.push("/profile")
			}
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
									initialMedia={customerProfile.coverPhoto}
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
									initialMedia={customerProfile.profilePicture}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input placeholder="Moki" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bio</FormLabel>
							<FormControl>
								<Textarea placeholder="I love buying fruits" {...field} />
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
