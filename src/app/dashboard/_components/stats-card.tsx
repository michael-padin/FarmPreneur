import { Button } from "@/components/ui/button"
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
			<Button size={"icon"} className="cursor-default hover:bg-primary">
				<Icon className={cn(iconClassName)} />
			</Button>
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold">{total}</div>
			<p className="text-xs text-muted-foreground">{footerText}</p>
		</CardContent>
	</Card>
)
