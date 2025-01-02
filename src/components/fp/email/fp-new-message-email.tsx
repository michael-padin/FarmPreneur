import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface NewMessageEmailProps {
	recipientName: string
	senderName: string
	messagePreview: string
	dashboardUrl: string
}

export function NewMessageEmail({
	recipientName,
	senderName,
	messagePreview,
	dashboardUrl
}: NewMessageEmailProps) {
	return (
		<EmailLayout previewText={`New message from ${senderName} on FarmPreneur`}>
			<Heading className="mb-6 text-center text-3xl font-bold text-green-600">
				New Message Received
			</Heading>
			<Text className="mb-4 text-base text-gray-700">
				Dear {recipientName},
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				You have received a new message from {senderName} on FarmPreneur.
			</Text>
			<Text className="mb-4 text-base italic text-gray-700">
				{messagePreview}...&quote;
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white"
				>
					View Full Message
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				To respond to this message or for any other inquiries, please log in to
				your FarmPreneur account or contact our support team at{" "}
				<Link
					href="mailto:support@farmpreneur.com"
					className="text-green-600 hover:underline"
				>
					support@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				Happy farming and selling!
			</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
