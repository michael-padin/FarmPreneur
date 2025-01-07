import { Loader2 } from "lucide-react"

export default function Loading() {
	return (
		<div className="h-screen">
			<div className="flex h-full items-center justify-center">
				<Loader2 className="animate-spin text-primary" />
			</div>
		</div>
	)
}
