"use client"

import Link from "next/link"
import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, buttonVariants } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { FGSubmitBtn } from "@/components/fg/fp-submit-btn"
import { ForgotPasswordSchema, ForgotPasswordType } from "../types"
import { sendPasswordResetEmail } from "../actions"
import { cn } from "@/lib/utils"
import { showErrorToast } from "@/lib/handle-error"

export default function ForgotPasswordForm() {
	const [isPending, startTransition] = useTransition()

	const form = useForm<ForgotPasswordType>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: ""
		}
	})

	async function onSubmit(data: ForgotPasswordType) {
		startTransition(() => {
			sendPasswordResetEmail(data).then((res) => {
				if (res.error) {
					showErrorToast(res.error)
				} else {
					toast.success("Email sent")
				}
			})
		})
	}

	const handleResend = () => {
		startTransition(async () => {
			form.handleSubmit(onSubmit)()
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="space-y-4" disabled={isPending}>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Enter your email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-xs">
							<p>Didn&apos;t receive the email?</p>
							<Button
								variant="link"
								className="h-auto p-0 text-xs"
								type="button"
								disabled={!form.formState.isDirty}
								onClick={handleResend}
							>
								Resend
							</Button>
						</div>
						<FGSubmitBtn
							text="Send reset password email"
							disabled={isPending || !form.formState.isDirty}
							className="w-full"
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
