"use client"

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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot
} from "@/components/ui/input-otp"
import { useCallback, useEffect, useState, useTransition } from "react"
import { FGSubmitBtn } from "@/components/fg/fp-submit-btn"
import { redirect } from "next/navigation"
import { resendCode, verifyCode } from "../actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { VerificationFormSchema, VerificationType } from "../types"
import { getEmailOtpExpirationByUserIdUseCase } from "@/use-cases/email-otp"
import { Session } from "next-auth"
import { isOtpExpired } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { showErrorToast } from "@/lib/handle-error"
interface InputOTPFormProps {
	user: Session["user"]
	otp?: Awaited<ReturnType<typeof getEmailOtpExpirationByUserIdUseCase>>
}
export function InputOTPForm({ user, otp }: InputOTPFormProps) {
	const { update } = useSession()
	const [canResend, setCanResend] = useState(false)
	const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

	const [isPending, startTransition] = useTransition()
	const [isResending, startResending] = useTransition()
	const form = useForm<VerificationType>({
		resolver: zodResolver(VerificationFormSchema),
		defaultValues: {
			code: ""
		}
	})

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
	}

	const handleResend = useCallback(() => {
		// Here you would typically call your API to resend the OTP
		startResending(() => {
			resendCode(user?.id || "").then((res) => {
				if (res.error) {
					showErrorToast(res.error)
				} else {
					toast.success("Code Resent")
					const expirationTime = new Date(res.data!.expiresAt).getTime()
					const currentTime = new Date().getTime()
					const remainingTime = Math.max(
						0,
						Math.floor((expirationTime - currentTime) / 1000)
					)
					setTimeLeft(remainingTime)
					setCanResend(false)
				}
			})
		})
	}, [user?.id])

	function onSubmit(data: VerificationType) {
		startTransition(async () => {
			const res = await verifyCode({
				...data,
				userId: user?.id || "",
				email: user?.email || ""
			})
			if (res.error) {
				showErrorToast(res.error)
				return
			}

			await update({
				...user,
				isEmailVerified: res.data?.isEmailVerified || true
			})

			setTimeLeft(0)
			toast.success("Email Verified")

			if (user.role === "ADMIN") {
				redirect("/dashboard")
			} else if (user.role === "FARMER") {
				redirect("/farmer-registration")
			} else {
				redirect("/")
			}
		})
	}

	useEffect(() => {
		if (!user?.isEmailVerified && !otp) {
			handleResend()
		}
	}, [handleResend, otp, user?.isEmailVerified])

	useEffect(() => {
		if (otp) {
			if (!isOtpExpired(otp?.expiresAt)) {
				const expirationTime = new Date(otp.expiresAt).getTime()
				const currentTime = new Date().getTime()
				const remainingTime = Math.max(
					0,
					Math.floor((expirationTime - currentTime) / 1000)
				)
				setTimeLeft(remainingTime)
			} else {
				setCanResend(true)
				setTimeLeft(0)
			}
		} else {
			setCanResend(true)
			setTimeLeft(0)
		}
	}, [])

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		} else {
			setCanResend(true)
		}
	}, [timeLeft])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="mx-auto w-full space-y-6">
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem className="mx-auto flex flex-col justify-center">
								<FormLabel>One-Time Password</FormLabel>
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
					<div className="space-y-2">
						<FGSubmitBtn
							disabled={!form.formState.isDirty}
							text="Verify"
							isLoading={isPending}
							className="w-full"
						/>
						<Button
							variant="secondary"
							className="w-full"
							type="button"
							onClick={handleResend}
							disabled={!canResend}
						>
							{isResending ? (
								<Loader2 className="animate-spin" />
							) : !canResend ? (
								<span>
									Resend code in{" "}
									<span className="text-primary">{formatTime(timeLeft)}</span>
								</span>
							) : (
								"Resend"
							)}
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
