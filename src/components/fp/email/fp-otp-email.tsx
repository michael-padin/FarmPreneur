import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface OTPEmailProps {
	otp: string
	companyName: string
	recipientName?: string
}

export function OTPEmail({
	otp,
	companyName,
	recipientName = "Valued Customer"
}: OTPEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>FarmPreneur Email Verification</Preview>
			<Tailwind>
				<Body className="bg-gray-100 p-2 font-sans">
					<Container className="mx-auto my-8 space-y-4 rounded-lg bg-white p-4 shadow-lg">
						<Heading className="mb-2 text-center text-3xl font-bold text-muted-foreground">
							Verify your email to sign in to{" "}
							<span className="text-green-600">{companyName}</span>
						</Heading>
						<Text className="text-muted-foreground">
							Hello <strong>{recipientName}</strong>,
						</Text>
						<Text className="text-muted-foreground">
							You&apos;ve requested a verification code from {companyName}.
							Please use the following code to complete your action:
						</Text>
						<Section className="text-center">
							<Text className="inline-block rounded-md bg-green-100 px-4 py-2 font-mono text-2xl font-bold text-green-600">
								{otp}
							</Text>
						</Section>
						<Text className="mt-4 text-muted-foreground">
							This code will expire in 10 minutes for security reasons.
						</Text>
						<Text className="text-muted-foreground">
							If you didn&apos;t request this code, please disregard this email
							or contact our support team.
						</Text>
						<Hr className="my-4 border-gray-300" />
						<Text className="text-center text-sm text-gray-500">
							This is an automated message from {companyName}. Please do not
							reply to this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
