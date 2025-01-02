import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface ProductApprovalEmailProps {
	farmerName: string
	productName: string
	dashboardUrl: string
}

export function ProductApprovalEmail({
	farmerName,
	productName,
	dashboardUrl
}: ProductApprovalEmailProps) {
	return (
		<EmailLayout previewText={`Your product ${productName} has been approved!`}>
			<Heading className="mb-6 text-center text-3xl font-bold text-green-600">
				Product Approved!
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {farmerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				Great news! Your product{" "}
				<span className="text-green-600">{productName}</span> has been approved
				and is now listed on the FarmPreneur marketplace.
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white"
				>
					View Your Product
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				If you need to make any changes or have any questions, please don&apos;t
				hesitate to contact our support team at{" "}
				<Link
					href="mailto:support@farmpreneur.com"
					className="text-green-600 hover:underline"
				>
					support@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">Best regards,</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
