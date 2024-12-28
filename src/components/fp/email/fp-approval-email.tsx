import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface FPApprovalEmailProps {
	farmerName: string
	farmName: string
	dashboardUrl: string
}

export function FPApprovalEmail({
	farmerName,
	farmName,
	dashboardUrl
}: FPApprovalEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>
				Welcome to FarmPreneur - Your application has been approved!
			</Preview>
			<Tailwind>
				<Body className="bg-gray-100 p-2 font-sans">
					<Container className="mx-auto my-8 space-y-4 rounded-lg bg-white p-4 shadow-lg">
						<Section className="rounded-lg bg-white p-8 shadow-lg">
							{/* <Img
								src="https://example.com/farmmarket-logo.png"
								width="120"
								height="40"
								alt="FarmMarket Logo"
								className="mx-auto mb-6"
							/> */}
							<Heading className="mb-6 text-center text-3xl font-bold text-green-600">
								Welcome to FarmerPreneur!
							</Heading>
							<Text className="mb-4 text-base text-gray-700">
								Dear {farmerName},
							</Text>
							<Text className="mb-4 text-base text-gray-700">
								Congratulations! We&apos;re excited to inform you that your
								application for{" "}
								<span className="text-green-600">{farmName}</span> has been
								approved. Welcome to the FarmPreneur - your gateway to
								connecting with buyers and growing your agricultural business!
							</Text>
							<Section className="mb-6 text-center">
								<Button
									href={dashboardUrl}
									className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white"
								>
									Access Your Farm Dashboard
								</Button>
							</Section>
							<Text className="mb-6 text-base text-gray-700">
								If you have any questions or need assistance, our farmpreneur
								support team is here to help. Reach out to us at{" "}
								<Link
									href="mailto:support@farmmarket.com"
									className="text-green-600 hover:underline"
								>
									support@farmpreneur.com
								</Link>{" "}
							</Text>
							<Text className="mb-6 text-base text-gray-700">
								We&apos;re thrilled to have you onboard and can&pos;t wait to
								see your products in our marketplace!
							</Text>
							<Text className="mb-4 text-base text-gray-700">
								Happy selling,
							</Text>
							<Text className="text-base font-bold text-gray-700">
								The FarmPreneur Team
							</Text>
							<Hr className="my-6 border-gray-300" />
							<Text className="text-center text-xs text-gray-500">
								© 2024 FarmPreneur. All rights reserved.
								<br />
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
