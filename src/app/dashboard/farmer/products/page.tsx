import { Box, MessageCircleMore } from "lucide-react"

import { BottomNav } from "../_components/bottom-navigation"
import { StatusTabs } from "./_components/tab-list"

export default function ProductsPage() {
	return (
		<main className="w-full">
			<header className="fixed left-0 right-0 top-0 w-full bg-background px-4 py-4 md:hidden">
				<div className="flex w-full items-center justify-between">
					<h1 className="text-xl">Products</h1>
					<div>
						<MessageCircleMore className="stroke-primary" />
					</div>
				</div>
				<div></div>
				<StatusTabs />
			</header>
			<div className="h-screen">
				{/* Main Content */}
				<div className="flex h-full flex-col items-center justify-center text-muted-foreground">
					<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
						<Box className="h-8 w-8" />
					</div>
					<p className="text-sm">No products listed</p>
				</div>
			</div>
			<main className="container mx-auto max-w-md flex-1 p-4"></main>
			<BottomNav />
		</main>
	)
}
