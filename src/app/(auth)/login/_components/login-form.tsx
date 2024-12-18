"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
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

import { FPPasswordInput } from "@/components/fp/fp-password-input"
import { showErrorToast } from "@/lib/handle-error"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { useRouter } from "next/navigation"
import { LoginSchema, LoginType } from "../_types"
import { signInWithCredentials } from "../action"

const LoginForm = () => {
	const router = useRouter()
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
			signInWithCredentials(data).then((res) => {
				if (res.error) {
					showErrorToast(res.error)
					return
				}

				if (!res.data?.isEmailVerified) {
					router.push("/verify-email")
					return
				}

				router.push(DEFAULT_LOGIN_REDIRECT(res.data.role))
			})
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset disabled={isPending} className="space-y-4">
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
										className="ml-auto inline-block text-xs text-primary underline"
									>
										Forgot your password?
									</Link>
								</div>
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
						disabled={isPending || !form.formState.isDirty}
					>
						{isPending ? <Loader2 className="animate-spin" /> : "Log in"}
					</Button>
				</fieldset>
			</form>
		</Form>
	)
}

export default LoginForm
