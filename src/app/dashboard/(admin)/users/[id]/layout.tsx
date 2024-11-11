import { Header } from "@/app/_components/header"

export default async function UserLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />
			{children}
		</>
	)
}
