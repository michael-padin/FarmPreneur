import { FPBackButton } from "@/components/fp/fp-back-button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { AuthLeftSection } from "../_components/auth-left-section"
import { AuthRightSection } from "../_components/auth-right-section"
import ForgotPasswordForm from "./_components/forgot-password-form"

export default async function verifyPage() {
	return (
		<>
			<AuthLeftSection>
				<div className="">
					<FPBackButton />
					<Card className="lg:max-w-[453.6px] lg:border-0 lg:shadow-none">
						<CardHeader>
							<CardTitle>Forgot your password?</CardTitle>
							<CardDescription>
								Enter your email address below and we&apos;ll send you a link to
								reset your password.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ForgotPasswordForm />
						</CardContent>
					</Card>
				</div>
			</AuthLeftSection>
			<AuthRightSection
				imageProps={{ src: "/auth2.svg", alt: "Forgot Password Image" }}
			/>
		</>
	)
}
