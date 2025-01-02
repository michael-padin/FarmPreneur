import { Button, Heading, Link, Section, Text } from "@react-email/components"
import { EmailLayout } from "./email-layout"

interface ProductOutOfStockEmailProps {
	farmerName: string
	productName: string
	dashboardUrl: string
}

export function ProductOutOfStockEmail({
	farmerName,
	productName,
	dashboardUrl
}: ProductOutOfStockEmailProps) {
	return (
		<EmailLayout previewText={`Your product ${productName} is out of stock`}>
			<Heading className="mb-6 text-center text-3xl font-bold text-orange-600">
				Product Out of Stock
			</Heading>
			<Text className="mb-4 text-base text-gray-700">Dear {farmerName},</Text>
			<Text className="mb-4 text-base text-gray-700">
				This is to inform you that your product{" "}
				<span className="font-semibold">{productName}</span> is currently out of
				stock on the FarmPreneur marketplace.
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				Please update your inventory as soon as possible to ensure continued
				visibility and sales of this product.
			</Text>
			<Section className="mb-6 text-center">
				<Button
					href={dashboardUrl}
					className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white"
				>
					Update Inventory
				</Button>
			</Section>
			<Text className="mb-6 text-base text-gray-700">
				If you need any assistance or have questions about managing your
				inventory, please don&apos;t hesitate to contact our farmer support team
				at{" "}
				<Link
					href="mailto:farmersupport@farmpreneur.com"
					className="text-blue-600 hover:underline"
				>
					farmersupport@farmpreneur.com
				</Link>{" "}
			</Text>
			<Text className="mb-4 text-base text-gray-700">
				Thank you for your prompt attention to this matter.
			</Text>
			<Text className="text-base font-bold text-gray-700">
				The FarmPreneur Team
			</Text>
		</EmailLayout>
	)
}
