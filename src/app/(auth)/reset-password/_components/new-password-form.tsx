"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { FGPasswordInput } from "@/components/fg/fg-password-input"
import { NewPasswordFormSchema, NewPasswordFormType } from "../types"
import { createNewPassword } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FGSubmitBtn } from "@/components/fg/fp-submit-btn"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NewPasswordForm({ token }: { token: string }) {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()
	const form = useForm<NewPasswordFormType>({
		resolver: zodResolver(NewPasswordFormSchema),
		defaultValues: {
			token: token,
			password: "",
			confirmPassword: ""
		}
	})

	function onSubmit(data: NewPasswordFormType) {
		startTransition(() => {
			createNewPassword(data).then((res) => {
				if (res.error) {
					toast.error(res.error)
				} else {
					toast.success("Password reset successfully")
					form.reset()
					router.push("/login")
				}
			})
		})
		// Here you would typically send the new password to your backend
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="space-y-4" disabled={isPending}>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<FGPasswordInput {...field} autoComplete="new-password" />
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
								<FormLabel>Confirm New Password</FormLabel>
								<FormControl>
									<FGPasswordInput {...field} autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div>
						<FGSubmitBtn disabled={isPending} text="Reset password" />
						<Button variant="link" asChild>
							<Link href="/login" className="flex w-full items-center">
								<ArrowLeft className="mr-2 h-4 w-4" /> Back to login
							</Link>
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
