import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface ProductExpiredEmailProps {
	farmerName: string
	productName: string
	expirationDate: string
	dashboardUrl: string
}

export function ProductExpiredEmail({
	farmerName,
	productName,
	expirationDate,
	dashboardUrl
}: ProductExpiredEmailProps) {
	return (
		<EmailLayout previewText={`Your product ${productName} has expired`}>
			<Heading className="mb-6 text-center text-3xl font-bold text-yellow-600">
				Product Expired
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {farmerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				This is to inform you that your product{" "}
				<span className="font-semibold">{productName}</span> has expired on{" "}
				{expirationDate} and is no longer visible on the FarmPreneur
				marketplace.
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white"
				>
					Update Product
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				If you wish to relist this product or have any questions, please visit
				your dashboard or contact our farmer support team at{" "}
				<Link
					href="mailto:farmersupport@farmpreneur.com"
					className="text-blue-600 hover:underline"
				>
					farmersupport@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				Thank you for your attention to this matter.
			</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
