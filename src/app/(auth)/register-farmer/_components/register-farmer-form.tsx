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
import { RegisterFarmerSchema, RegisterFarmerType } from "../_types"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { registerFarmer } from "../_action"

const RegisterFarmerForm = () => {
	const session = useSession()
	const user = session?.data?.user
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<RegisterFarmerType>({
		resolver: zodResolver(RegisterFarmerSchema),
		defaultValues: {
			userId: user?.id,
			email: user?.email || "",
			name: "",
			description: "",
			contactNumber: "+63",
			location: "",
			images: []
		}
	})

	const onSubmit = async (data: RegisterFarmerType) => {
		startTransition(() => {
			registerFarmer(data).then((res) => {
				if (res.success) {
					toast.success(res.success)
					router.push("/admin-approval")
				} else {
					toast.error(res.error)
				}
			})
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset disabled={isPending} className="space-y-3">
					<FormField
						control={form.control}
						name="userId"
						render={({ field }) => (
							<FormItem className="hidden">
								<FormControl>
									<Input hidden />
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
									<Input placeholder="@email.com" {...field} disabled />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Farm Description</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="products"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Products grown/raised</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="Rice, Eggplant, Tomatoes, Bananas"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Farm Location</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Conalum, Argao, Cebu" />
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
								<FormLabel>Contact number</FormLabel>
								<FormControl>
									<FGSinglePhoneINput {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full">
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
