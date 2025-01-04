import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface NewOrderEmailProps {
	farmerName: string
	orderNumber: string
	orderItems: string
	orderTotal: string
	dashboardUrl: string
	actionPrompt?: string
	customerName?: string
}

export function NewOrderEmail({
	customerName,
	farmerName,
	orderNumber,
	orderItems,
	orderTotal,
	dashboardUrl
}: NewOrderEmailProps) {
	return (
		<EmailLayout previewText={`New order received: #${orderNumber}`}>
			<Heading className="mb-6 text-center text-3xl font-bold text-green-600">
				New Order Received!
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {farmerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				You have received a new order from <strong>{customerName}</strong> (#
				{orderNumber}) on FarmPreneur. Here are the details:
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				<strong>Order Items:</strong> {orderItems}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				<strong>Total Amount:</strong> {orderTotal}
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white"
				>
					View Order Details
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				Please prepare the items for pickup or delivery as per the
				customer&apos;s preference. If you have any questions, please contact
				our support team at{" "}
				<Link
					href="mailto:support@farmpreneur.com"
					className="text-green-600 hover:underline"
				>
					support@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				Thank you for your prompt attention to this order.
			</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
