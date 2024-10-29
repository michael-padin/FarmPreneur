"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import React, { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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

import { LoginSchema, LoginType } from "../_types"
import { siginInWithCredentials } from "../action"
import { FGPasswordInput } from "@/components/fg/fg-password-input"
import { resendCode } from "../../verify-email/actions"

const LoginForm = () => {
	const [isPending, startTransition] = useTransition()
	const form = useForm<LoginType>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	})

	const onSubmit = async (data: LoginType) => {
		startTransition(() => {
			siginInWithCredentials(data).then((res) => {
				if (res.error) {
					toast.error(res.error)
				} else {
					if (!res.data?.isVerified) {
						resendCode(res.data!.id!).then((res) => {
							if (res.error) {
								toast.error(res.error)
							} else {
								toast.success("Code Resent ", {
									description: "A new code has been sent to your email"
								})
							}
						})
					}
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="your@email.com" {...field} type="email" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="grid">
								<div className="flex items-center">
									<FormLabel>Password</FormLabel>
									<Link
										href="/forgot-password"
										className="ml-auto inline-block text-sm underline"
									>
										Forgot your password?
									</Link>
								</div>
								<FormControl>
									<FGPasswordInput {...field} autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? <Loader2 className="animate-spin" /> : "Log in"}
					</Button>
				</fieldset>
			</form>
		</Form>
	)
}

export default LoginForm
