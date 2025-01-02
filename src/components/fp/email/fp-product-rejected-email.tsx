import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface ProductRejectedEmailProps {
	farmerName: string
	productName: string
	rejectionReason: string
	dashboardUrl: string
}

export function ProductRejectedEmail({
	farmerName,
	productName,
	rejectionReason,
	dashboardUrl
}: ProductRejectedEmailProps) {
	return (
		<EmailLayout
			previewText={`Your product ${productName} has not been approved`}
		>
			<Heading className="mb-6 text-center text-3xl font-bold text-red-600">
				Product Not Approved
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {farmerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				We regret to inform you that your product{" "}
				<span className="font-semibold">{productName}</span> has not been
				approved for listing on the FarmPreneur marketplace.
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				<strong>Reason for rejection:</strong> {rejectionReason}
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white"
				>
					Review Product Details
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				If you would like to appeal this decision or have any questions, please
				contact our farmer support team at{" "}
				<Link
					href="mailto:farmersupport@farmpreneur.com"
					className="text-blue-600 hover:underline"
				>
					farmersupport@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				We appreciate your understanding and look forward to reviewing your
				future product submissions.
			</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
