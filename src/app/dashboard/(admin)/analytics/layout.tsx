import { Header } from "@/app/_components/header"

export default function AnalyticsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<section>
			<Header />
			{children}
		</section>
	)
}
