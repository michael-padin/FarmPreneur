import { Send } from "lucide-react"

export function EmptyChatState() {
	return (
		<div className="flex h-[calc(100vh-140px)] flex-col items-center justify-center px-4 text-center">
			<div className="mb-4 rounded-full bg-primary/10 p-6">
				<Send className="h-12 w-12 text-primary" />
			</div>
			<h3 className="mb-2 text-2xl font-semibold">Start a conversation</h3>
			<p className="mb-6 max-w-md text-muted-foreground">
				Send a message to start your conversation. Discuss product details,
				delivery options, or any questions you might have.
			</p>
		</div>
	)
}
