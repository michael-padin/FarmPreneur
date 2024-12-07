import { Pickaxe } from "lucide-react"

export default function UnderConstruction() {
	return (
		<div className="to-green-60 hidden min-h-screen items-center justify-center bg-gradient-to-br from-green-500 p-4 lg:flex">
			<div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-xl">
				{/* Desktop View */}
				<div className="hidden text-center md:block">
					<Pickaxe className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
					<h1 className="mb-2 text-2xl font-bold text-primary">
						Desktop View Under Construction
					</h1>
					<p className="mb-4 text-muted-foreground">
						Our platform currently supports mobile view only. We&apos;re
						actively working on building an optimized desktop experience.
					</p>
					<p className="font-semibold text-muted-foreground">
						Thank you for your patience!
					</p>
				</div>
			</div>
		</div>
	)
}
