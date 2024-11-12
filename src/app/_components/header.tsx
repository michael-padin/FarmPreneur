import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, MessageCircle } from "lucide-react"

export function Header() {
	return (
		<header className="w-full border-b bg-card px-4">
			<div className="flex w-full items-center">
				<div className="flex h-16 shrink-0 items-center gap-2">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
				</div>
				<div className="flex w-full items-center justify-end gap-2">
					<ModeToggle />
					<Button variant="ghost" size="icon" className="size-8">
						<Bell className="size-4" />
					</Button>
					<Button variant="ghost" size="icon" className="size-8">
						<MessageCircle className="size-4" />
					</Button>
				</div>
			</div>
		</header>
	)
}
