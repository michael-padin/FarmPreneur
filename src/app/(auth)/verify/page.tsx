"use client"
import { Link } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot
} from "@/components/ui/input-otp"
import { useToast } from "@/components/ui/use-toast"

export default function OtpPage() {
	const [otp, setOtp] = useState<string>("")
	const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
	const [canResend, setCanResend] = useState(false)
	const { toast } = useToast()

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		} else {
			setCanResend(true)
		}
	}, [timeLeft])

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
	}

	const handleVerify = useCallback(() => {
		if (otp.length === 6) {
			// Here you would typically send the OTP to your server for verification
			console.log("Verifying OTP:", otp)
			toast({
				title: "Verification Attempt",
				description: `Attempting to verify OTP: ${otp}`
			})
		} else {
			toast({
				title: "Invalid OTP",
				description: "Please enter a 6-digit OTP",
				variant: "destructive"
			})
		}
	}, [otp, toast])

	const handleResend = useCallback(() => {
		// Here you would typically call your API to resend the OTP
		setTimeLeft(300)
		setCanResend(false)
		setOtp("")
		toast({
			title: "OTP Resent",
			description: "A new OTP has been sent to your device"
		})
	}, [toast])
	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-[350px]">
				<Link
					className="flex items-center justify-center gap-2 text-3xl font-black text-[#404145] lg:hidden"
					href="/"
				>
					<img src="/logo.svg" alt="" className="h-[100px] w-[100px]" />
				</Link>
				<CardHeader>
					<CardTitle className="text-center text-2xl">Enter OTP</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-4 text-center text-sm text-gray-500">
						Please enter the 6-digit code sent to your email address
					</p>
					<InputOTP maxLength={6}>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
						</InputOTPGroup>
						<InputOTPSeparator />
						<InputOTPGroup>
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>
					<p className="mt-4 text-center text-sm text-gray-500">
						Time remaining: {formatTime(timeLeft)}
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Button className="w-full" onClick={handleVerify}>
						Verify
					</Button>
					<Button
						variant="outline"
						className="w-full"
						onClick={handleResend}
						disabled={!canResend}
					>
						Resend
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
