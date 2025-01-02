import {
	Body,
	Container,
	Head,
	Hr,
	Html,
	Preview,
	Section,
	Text
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface EmailLayoutProps {
	previewText: string
	children: React.ReactNode
}

export function EmailLayout({ previewText, children }: EmailLayoutProps) {
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-gray-100 p-2 font-sans">
					<Container className="mx-auto my-8 space-y-4 rounded-lg bg-white p-4 shadow-lg">
						<Section className="rounded-lg bg-white p-8 shadow-lg">
							{children}
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
