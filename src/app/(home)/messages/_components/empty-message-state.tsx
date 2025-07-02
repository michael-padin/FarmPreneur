import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

export function EmptyMessageState() {
	return (
		<div className="flex h-[calc(100vh-128px)] flex-col items-center justify-center px-4 text-center">
			<div className="mb-4 rounded-full bg-primary/10 p-6">
				<MessageSquare className="h-12 w-12 text-primary" />
			</div>
			<h3 className="mb-2 text-2xl font-semibold">No messages yet</h3>
			<p className="mb-6 max-w-md text-muted-foreground">
				You haven&apos;t started any conversations yet. Start browsing products
				and connect with farmers to begin messaging.
			</p>
			<Button asChild>
				<Link href="/products">Browse Products</Link>
			</Button>
		</div>
	)
}
