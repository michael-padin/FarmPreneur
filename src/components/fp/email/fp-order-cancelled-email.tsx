import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface OrderCancelledEmailProps {
	customerName: string
	orderNumber: string
	cancellationReason: string
	dashboardUrl: string
}

export function OrderCancelledEmail({
	customerName,
	orderNumber,
	cancellationReason,
	dashboardUrl
}: OrderCancelledEmailProps) {
	return (
		<EmailLayout previewText={`Order #${orderNumber} has been cancelled`}>
			<Heading className="mb-6 text-center text-3xl font-bold text-red-600">
				Order Cancelled
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {customerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				We regret to inform you that your order #{orderNumber} has been
				cancelled.
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				<strong>Reason for cancellation:</strong> {cancellationReason}
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white"
				>
					View Order Details
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				If you have any questions about this cancellation or would like to place
				a new order, please don&apos;t hesitate to contact our customer support
				team at{" "}
				<Link
					href="mailto:support@farmpreneur.com"
					className="text-blue-600 hover:underline"
				>
					support@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				We apologize for any inconvenience this may have caused.
			</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
