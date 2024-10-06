"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot
} from "@/components/ui/input-otp"
import { useCallback, useEffect, useState, useTransition } from "react"
import { FGSubmitBtn } from "@/components/fg/fp-submit-btn"
import { useRouter } from "next/navigation"
import { resendCode, verifyCode } from "../actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { VerificationFormSchema, VerificationType } from "../types"

export function InputOTPForm({ userId }: { userId: string }) {
	const router = useRouter()
	const [canResend, setCanResend] = useState(false)
	const [timeLeft, setTimeLeft] = useState(600) // 5 minutes in seconds

	const [isPending, startTransition] = useTransition()
	const [isResending, startResending] = useTransition()
	const form = useForm<VerificationType>({
		resolver: zodResolver(VerificationFormSchema),
		defaultValues: {
			userId: userId,
			code: ""
		}
	})

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
	}

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		} else {
			setCanResend(true)
		}
	}, [timeLeft])

	function onSubmit(data: VerificationType) {
		startTransition(() => {
			verifyCode(data).then((res) => {
				if (res.error) {
					toast.error(res.error)
				} else {
					toast.success("Email verified")
					router.push("/login")
				}
			})
		})
	}

	const handleResend = useCallback(() => {
		// Here you would typically call your API to resend the OTP
		setTimeLeft(300)
		setCanResend(false)
		startResending(() => {
			resendCode(userId).then((res) => {
				if (res.error) {
					toast.error(res.error)
				} else {
					toast.success("Code Resent ", {
						description: "A new code has been sent to your email"
					})
				}
			})
		})
	}, [userId])

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto w-2/3 space-y-6"
			>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormControl>
								<InputOTP maxLength={6} {...field}>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<p className="mt-4 text-center text-sm text-gray-500">
					Time remaining: {formatTime(timeLeft)}
				</p>
				<div className="space-y-2">
					<FGSubmitBtn disabled={isPending || isResending} text="Verify" />
					<Button
						variant="outline"
						className="w-full"
						onClick={handleResend}
						disabled={!canResend || isResending}
					>
						Resend
					</Button>
				</div>
			</form>
		</Form>
	)
}
