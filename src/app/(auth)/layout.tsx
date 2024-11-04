export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className="w-full lg:flex lg:h-screen lg:min-h-screen lg:overflow-hidden">
			{children}
		</div>
	)
}
