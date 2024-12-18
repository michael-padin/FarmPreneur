"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"

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
import { registerFarmer } from "../action"

import { FPPasswordInput } from "@/components/fp/fp-password-input"
import { showErrorToast } from "@/lib/handle-error"
import { registerSchema, RegisterSchema } from "@/validations/user"

const defaultValues: RegisterSchema = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: ""
}

const RegisterFarmerForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues
	})

	const onSubmit = (data: RegisterSchema) => {
		startTransition(async () => {
			const { error } = await registerFarmer(data)
			if (error) {
				showErrorToast(error)
				return
			}
			router.push("/verify-email")
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset disabled={isPending} className="space-y-4">
					<div className="flex gap-3">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="John" autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input placeholder="Doe" {...field} autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="johndoe@gmail.com"
										{...field}
										autoComplete="off"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<FPPasswordInput {...field} autoComplete="new-password" />
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
									<FPPasswordInput {...field} autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full"
						disabled={!form.formState.isDirty}
					>
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
