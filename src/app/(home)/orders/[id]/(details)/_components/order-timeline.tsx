import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getOrder } from "@/data-access/orders"

interface OrderTimelineProps {
	timeline: Awaited<ReturnType<typeof getOrder>>["statusHistory"]
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
	return (
		<Card className="border-none">
			<CardHeader className="p-3">
				<CardTitle className="text-base font-normal">
					Order Timeline Information
				</CardTitle>
				<CardDescription className="sr-only">
					Order timeline information
				</CardDescription>
			</CardHeader>
			<CardContent className="p-3 pt-0">
				<ol className="ml-3 border-l">
					{timeline.map((event, index) => (
						<li
							key={event.id}
							className={`relative mb-5 pl-3 ${index === 0 ? "text-primary" : ""}`}
						>
							<span
								className={`absolute -left-[5.5px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full ${index === 0 ? "bg-primary" : "bg-muted-foreground"} text-background`}
							></span>
							<p className="text-sm font-normal">{event.statusDescription}</p>
							<time className="block text-xs font-normal leading-none">
								{new Date(event.createdAt).toLocaleString()}
							</time>
						</li>
					))}
				</ol>
			</CardContent>
		</Card>
	)
}
