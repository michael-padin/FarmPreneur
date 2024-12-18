import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text
} from "@react-email/components"

interface ResetPasswordEmailProps {
	name: string
	resetPasswordLink: string
}

export function FPResetPasswordEmail({
	name = "John",
	resetPasswordLink = "https://example.com/reset-password"
}: ResetPasswordEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Reset your password</Preview>
			<Tailwind>
				<Body className="bg-white font-sans">
					<Container className="mx-auto max-w-xl px-4 py-5">
						<Heading className="mb-4 text-2xl font-bold text-gray-800">
							Password Reset Request
						</Heading>
						<Text className="mb-4 text-gray-700">Hello {name},</Text>
						<Text className="mb-4 text-gray-700">
							We received a request to reset your password. If you didn&apos;t
							make this request, you can ignore this email.
						</Text>
						<Section className="mb-6">
							<Button
								className="rounded-md bg-[#16a34a] px-4 py-3 text-center font-semibold text-white no-underline"
								href={resetPasswordLink}
							>
								Reset Password
							</Button>
						</Section>
						<Text className="mb-2 text-gray-700">
							If the button doesn&apos;t work, you can also copy and paste this
							link into your browser:
						</Text>
						<Text className="mb-6 break-all text-sm text-green-600">
							{resetPasswordLink}
						</Text>
						<Hr className="my-6 border-gray-300" />
						<Text className="text-sm text-gray-500">
							If you didn&apos;t request a password reset, please ignore this
							email or contact support if you have concerns.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
