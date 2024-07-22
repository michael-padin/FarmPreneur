"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tag } from "emblor"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState, useTransition } from "react"
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
import { Textarea } from "@/components/ui/textarea"

import { RegisterSchema, RegisterType } from "../_types"
import { register } from "../action"

//THIS SHOULD BE FETCH FROM ADMIN

// export async function getSkill() {
//   try {
//     const res = await fetch("/api/skills");
//     return await res.json();
//   } catch (error) {
//     console.log("Failed");
//   }
// }

const RegisterForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [tags, setTags] = useState<Tag[]>([])
	const form = useForm<RegisterType>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			address: "",
			contactNumber: "+63",
			description: "",
			password: "",
			confirmPassword: "",
			role: "BUYER"
		}
	})

	const onSubmit = async (data: RegisterType) => {
		startTransition(() => {
			register(data).then((res) => {
				if (res.success) {
					toast.success(res.success)
					router.push("/login")
				} else {
					toast.error(res.error)
				}
			})
		})
	}

	const getLatLng = async (address: string) => {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
				address
			)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
		)
		const data = await response.json()

		if (data.status === "OK") {
			const { lat, lng } = data.results[0].geometry.location
			return { lat, lng }
		} else {
			throw new Error("Error getting latitude and longitude")
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset disabled={isPending} className="space-y-3">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Name" {...field} />
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
									<Input placeholder="@email.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <FGInputAddress
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
					{/* 
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Description about your organization ... "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

					{/* <FormField
						control={form.control}
						name="preferredFoods"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Preferred products</FormLabel>
								<FormControl>
									<TagInput
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										{...field}
										placeholder="Bananas, Oranges, Lettuce"
										tags={tags}
										setTags={(newTags) => {
											setTags(newTags)
											form.setValue(
												"preferredFoods",
												newTags as [Tag, ...Tag[]]
											)
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/> */}

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<FGPasswordInput {...field} />
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
									<FGPasswordInput {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full">
						{isPending ? <Loader2 className="animate-spin" /> : "Register"}
					</Button>
				</fieldset>
			</form>
		</Form>
	)
}

export default RegisterForm
