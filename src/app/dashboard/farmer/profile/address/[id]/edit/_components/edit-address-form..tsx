"use client"

import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { FGSinglePhoneINput } from "@/components/fg/fg-single-phone-input"
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
import { editFarmerAddress } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { getAddressById } from "@/use-cases/address"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { editFarmerAddressSchema, EditFarmerAddressSchema } from "../validation"

interface AddressFormProps {
	address: Awaited<ReturnType<typeof getAddressById>>
}

export function FarmerEditAddressForm({ address }: AddressFormProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<EditFarmerAddressSchema>({
		resolver: zodResolver(editFarmerAddressSchema),
		defaultValues: {
			contactName: address.contactName,
			contactNumber: address.contactNumber,
			address: address.address,
			note: address.note
		}
	})

	const onSubmit = (values: EditFarmerAddressSchema) => {
		startTransition(async () => {
			const { error } = await editFarmerAddress({
				...values,
				addressId: address.id
			})

			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Address updated successfully", {
				position: "top-right"
			})
			router.push("/dashboard/farmer/profile/address")
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="contactName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contact Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter contact name" {...field} />
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
				{/* <FormField
					control={form.control}
					name="locationType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select address type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.entries(locationTypeItems).map(([value, label]) => (
										<SelectItem value={value} key={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/> */}
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
										lng: field.value.longitude || 0,
										lat: field.value.latitude || 0
									}}
									defaultValue={field.value.fullAddress || ""}
									showMap
								/>
							</FormControl>
							<FormDescription>
								Enter or select your address in the map. This will be use as you
								pickup point
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="note"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Note</FormLabel>
							<FormControl>
								<Textarea placeholder="Near the red gate" {...field} />
							</FormControl>
							<FormDescription>
								Provide specific instructions or landmarks to help locate your
								pickup point easily
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
					control={form.control}
					name="isDefault"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="font-normal">
								Set as default address
							</FormLabel>
						</FormItem>
					)}
				/> */}
				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? "Updating..." : "Update"}
				</Button>
			</form>
		</Form>
	)
}
