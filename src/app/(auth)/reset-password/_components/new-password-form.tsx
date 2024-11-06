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
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { showErrorToast } from "@/lib/handle-error"

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
					showErrorToast(res.error)
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
									<Input
										{...field}
										autoComplete="new-password"
										type="password"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="space-y-2">
						<FGSubmitBtn
							disabled={!form.formState.isDirty}
							text="Reset password"
							className="w-full"
							isLoading={isPending}
						/>
						<Link
							href="/login"
							className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
						>
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to log in
						</Link>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
