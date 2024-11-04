import { InputOTPForm } from "./_components/input-otp-form"
import { auth } from "@/auth"
import { getEmailOtpExpirationByUserIdUseCase } from "@/use-cases/email-otp"
import { redirect } from "next/navigation"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getUserByIdUseCase } from "@/use-cases/users"
import { AuthLeftSection } from "../_components/auth-left-section"
import { AuthRightSection } from "../_components/auth-right-section"

export default async function verifyEmailPage() {
	const session = await auth()

	console.log("session :>> ", session)

	if (!session) redirect("/login")

	if (!session.user) {
		redirect("/login")!
	}

	if (session.user.isEmailVerified) {
		if (session.user.role === "ADMIN") redirect("/dashboard")
		if (session.user.role === "CUSTOMER") redirect("/")
		if (session.user.role === "FARMER") redirect("/dashboard/farmer")
	}
	const user = await getUserByIdUseCase(session.user.id)
	const otp = await getEmailOtpExpirationByUserIdUseCase(session.user.id)

	return (
		<>
			<AuthLeftSection>
				<Card className="lg:border-0 lg:shadow-none">
					<CardHeader>
						<CardTitle>Verify Your Email</CardTitle>
						<CardDescription>
							Please enter the one-time password sent to your email.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<InputOTPForm user={session.user} otp={otp} />
					</CardContent>
				</Card>
			</AuthLeftSection>
			<AuthRightSection
				imageProps={{ src: "/auth2.svg", alt: "Verify Email Image" }}
			/>
		</>
	)
}
