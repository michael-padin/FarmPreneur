import { Button, Heading, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface AdminNotificationEmailProps {
	adminName: string
	notificationType: string
	content: string
	actionUrl: string
}

export const AdminNotificationEmail = ({
	adminName,
	notificationType,
	content,
	actionUrl
}: AdminNotificationEmailProps) => {
	return (
		<EmailLayout previewText={`Admin Notification: ${notificationType}`}>
			<Heading className="mb-4 text-2xl font-bold">Hello {adminName},</Heading>
			<Text className="mb-4">You have a new admin notification:</Text>
			<Section className="mb-4 rounded border border-gray-200 bg-gray-50 p-4">
				<Heading className="mb-2 text-xl font-semibold">
					{notificationType}
				</Heading>
				<Text>{content}</Text>
			</Section>
			<Button
				href={actionUrl}
				className="rounded bg-green-600 px-4 py-2 font-bold text-white"
			>
				Take Action
			</Button>
		</EmailLayout>
	)
}

export default AdminNotificationEmail
