import React from "react"
import { BottomNav } from "./_components"

interface HomeLayoutProps {
	children: React.ReactNode
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
	return (
		<div>
			{children}
			<div className="lg:hidden">
				<BottomNav />
			</div>
		</div>
	)
}

export default HomeLayout
