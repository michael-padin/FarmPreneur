import { BottomNav } from "./_components"

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div>
			{children}
			<div className="lg:hidden">
				<BottomNav />
			</div>
		</div>
	)
}
