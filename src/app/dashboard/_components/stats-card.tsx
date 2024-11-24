import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
	total: number
	Icon: LucideIcon
	title: string
	iconClassName?: string
	footerText?: string
}

export const StatsCard = ({
	title,
	Icon,
	total,
	footerText,
	iconClassName
}: StatsCardProps) => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium">{title}</CardTitle>
			<Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold">{total}</div>
			<p className="text-xs text-muted-foreground">{footerText}</p>
		</CardContent>
	</Card>
)
