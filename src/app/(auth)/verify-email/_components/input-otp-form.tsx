"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { getEmailOtpExpirationByUserIdUseCase } from "@/use-cases/email-otp"
import { Session } from "next-auth"
import { isOtpExpired } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { ROLE } from "@prisma/client"

interface InputOTPFormProps {
	user: Session["user"]
	otp?: Awaited<ReturnType<typeof getEmailOtpExpirationByUserIdUseCase>>
}
export function InputOTPForm({ user, otp }: InputOTPFormProps) {
	const router = useRouter()
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

	const redirectUser = (role: ROLE) => {
		switch (role) {
			case ROLE.CUSTOMER:
				router.push("/dashboard")
				break
			case ROLE.FARMER:
				router.push("/dashboard/farmer")
				break
			case ROLE.ADMIN:
				router.push("/dashboard")
				break
			default:
				router.push("/")
				break
		}
	}

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
	}

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
	}, [otp])

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		} else {
			setCanResend(true)
		}
	}, [timeLeft])

	function onSubmit(data: VerificationType) {
		console.info("USER HERE", user)
		startTransition(() => {
			verifyCode({
				...data,
				userId: user.id!,
				email: user.email!
			}).then((res) => {
				if (res.error) {
					toast.error(res.error)
				} else {
					if (res.data) {
						redirectUser(res.data.role)
					}
				}
			})
		})
	}

	const handleResend = useCallback(() => {
		// Here you would typically call your API to resend the OTP
		startResending(() => {
			resendCode(user.id!).then((res) => {
				if (res.error) {
					toast.error(res.error)
				} else {
					toast.success("Code Resent ", {
						description: "A new code has been sent to your email"
					})
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
	}, [user.id])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="mx-auto w-2/3 space-y-6">
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem className="mx-auto flex flex-col justify-center">
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
						<FGSubmitBtn
							disabled={!form.formState.isDirty}
							text="Verify"
							isLoading={isPending}
						/>
						<Button
							variant="outline"
							className="w-full"
							type="button"
							onClick={handleResend}
							disabled={!canResend}
						>
							{isResending ? <Loader2 className="animate-spin" /> : "Resend"}
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
