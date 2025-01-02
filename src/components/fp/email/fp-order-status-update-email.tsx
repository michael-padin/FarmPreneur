import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface OrderStatusUpdateEmailProps {
	customerName: string
	orderNumber: string
	newStatus: string
	statusDescription: string
	dashboardUrl: string
}

export function OrderStatusUpdateEmail({
	customerName,
	orderNumber,
	newStatus,
	statusDescription,
	dashboardUrl
}: OrderStatusUpdateEmailProps) {
	return (
		<EmailLayout
			previewText={`Order #${orderNumber} status update: ${newStatus}`}
		>
			<Heading className="mb-6 text-center text-3xl font-bold text-green-600">
				Order Status Update
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {customerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				The status of your order #{orderNumber} has been updated to:{" "}
				<strong>{newStatus}</strong>
			</Text>
			<Text className="mb-4 text-base text-gray-700">{statusDescription}</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white"
				>
					View Order Details
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				If you have any questions about your order, please don&apos;t hesitate
				to contact our customer support team at{" "}
				<Link
					href="mailto:support@farmpreneur.com"
					className="text-green-600 hover:underline"
				>
					support@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				Thank you for choosing FarmPreneur!
			</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
