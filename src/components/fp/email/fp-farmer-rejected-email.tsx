import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface FarmerRejectedEmailProps {
	farmerName: string
	farmName: string
	rejectionReason: string
	supportUrl: string
}

export function FarmerRejectedEmail({
	farmerName,
	farmName,
	rejectionReason,
	supportUrl
}: FarmerRejectedEmailProps) {
	return (
		<EmailLayout previewText="Your FarmPreneur application status">
			<Heading className="mb-6 text-center text-3xl font-bold text-red-600">
				FarmPreneur Application Update
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {farmerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				We appreciate your interest in joining FarmPreneur. After careful
				review, we regret to inform you that your application for{" "}
				<span className="font-semibold">{farmName}</span> has not been approved
				at this time.
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				<strong>Reason:</strong> {rejectionReason}
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={supportUrl}
					className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white"
				>
					Contact Support
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				If you believe there has been an error or you would like to provide
				additional information, please don&apos;t hesitate to reach out to our
				farmer support team at{" "}
				<Link
					href="mailto:farmersupport@farmpreneur.com"
					className="text-blue-600 hover:underline"
				>
					farmersupport@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				We encourage you to review our farmer guidelines and consider reapplying
				in the future.
			</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
