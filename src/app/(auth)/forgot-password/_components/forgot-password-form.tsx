"use client"

import Link from "next/link"
import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
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

import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { FGSubmitBtn } from "@/components/fg/fp-submit-btn"
import { ForgotPasswordSchema, ForgotPasswordType } from "../types"
import { sendPasswordResetEmail } from "../actions"

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
					toast.error(res.error)
				} else {
					toast.success("Email sent")
				}
			})
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
					{/* <div>
						<p>Did&apos;t receive the email?</p>
						<Button variant="outline" className="w-full" onClick={} disabled={}>
							Resend
						</Button>
					</div> */}
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
