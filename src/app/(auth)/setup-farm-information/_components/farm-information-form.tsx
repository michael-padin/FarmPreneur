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

import { getFarmDetailsByUserIdUseCase } from "@/use-cases/farm-details"
import {
	SetupFarmInformationSchema,
	setupFarmInformationSchema
} from "../types"
import AddressLocationPicker from "@/components/fg/fg-map-box-location-picker"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"

import { createFarmDetailsAction } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CompleteFarmerDetailsFormProps {
	farmDetails: Awaited<ReturnType<typeof getFarmDetailsByUserIdUseCase>>
	farmerEmail: string | undefined
	farmerId: string
}

export const CompleteFarmerDetailsForm = ({
	farmDetails,
	farmerEmail,
	farmerId
}: CompleteFarmerDetailsFormProps) => {
	const router = useRouter()
	const [isUpdatePending, startTransition] = useTransition()
	const form = useForm<SetupFarmInformationSchema>({
		resolver: zodResolver(setupFarmInformationSchema),
		defaultValues: {
			farmDescription: "Presko nga saging lami kaayu",
			images: [
				{
					filename: "Michael Padin Image",
					mimeType: "jpg",
					size: 1000,
					url: "heheh"
				}
			],
			address: {
				fullAddress: "Napo, Carcar City",
				street: "",
				region: "",
				country: "",
				postalCode: "",
				latitude: -74.006,
				longitude: 40.7128
			},
			farmName: `Michael Farm ${Math.floor(100 + Math.random() * 9000).toFixed(0)}`,
			products: ["Banana"]
		}
	})

	const onSubmit = async (data: SetupFarmInformationSchema) => {
		startTransition(async () => {
			const { error } = await createFarmDetailsAction(data, farmerId)
			if (error) {
				toast.error(error)
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
					<div className="space-y-2">
						<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Email
						</p>
						<Input readOnly value={farmerEmail} disabled />
					</div>
					<Separator className="my-8" />
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
								<FormDescription>Enter your exact farm address</FormDescription>
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
						name="images"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Farm Images</FormLabel>
								<FormControl>
									<FileUpload {...field} multiple />
								</FormControl>
								<FormDescription>
									Upload up to 5 images of your farm
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
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
					/>
				</fieldset>
				<Button type="submit" className="w-full" disabled={isUpdatePending}>
					Submit
				</Button>
			</form>
		</Form>
	)
}
