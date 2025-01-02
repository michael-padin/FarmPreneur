import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface FarmerApprovedEmailProps {
	farmerName: string
	farmName: string
	dashboardUrl: string
}

export function FarmerApprovedEmail({
	farmerName,
	farmName,
	dashboardUrl
}: FarmerApprovedEmailProps) {
	return (
		<EmailLayout previewText="Welcome to FarmPreneur - Your application has been approved!">
			<Heading className="mb-6 text-center text-3xl font-bold text-green-600">
				Welcome to FarmerPreneur!
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {farmerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				Congratulations! We&apos;re excited to inform you that your application
				for <span className="text-green-600">{farmName}</span> has been
				approved. Welcome to FarmPreneur - your gateway to connecting with
				buyers and growing your agricultural business!
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white"
				>
					Access Your Farm Dashboard
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				If you have any questions or need assistance, our farmpreneur support
				team is here to help. Reach out to us at{" "}
				<Link
					href="mailto:support@farmpreneur.com"
					className="text-green-600 hover:underline"
				>
					support@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-6 text-base text-gray-700">
				We&apos;re thrilled to have you onboard and can&apos;t wait to see your
				products in our marketplace!
			</Text>
			<Text className="mb-4 text-base text-gray-700">Happy selling,</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
