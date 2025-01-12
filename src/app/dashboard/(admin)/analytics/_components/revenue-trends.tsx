"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from "@/components/ui/chart"
import { DateRange } from "react-day-picker"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

const chartData = [
	{ month: "January", orders: 186, revenue: 100 },
	{ month: "February", orders: 305, revenue: 1000 },
	{ month: "March", orders: 237, revenue: 3210 },
	{ month: "April", orders: 73, revenue: 1223 },
	{ month: "May", orders: 209, revenue: 130 },
	{ month: "June", orders: 214, revenue: 4325 }
]
const chartConfig = {
	orders: {
		label: "Orders",
		color: "hsl(var(--chart-1))"
	},
	revenue: {
		label: "Revenue",
		color: "hsl(var(--chart-2))"
	}
} satisfies ChartConfig

interface OrderTrendsProps {
	dateRange: DateRange | undefined
}
export function RevenueTrends({ dateRange }: OrderTrendsProps) {
	return (
		<Card className="col-span-2">
			<CardHeader>
				<CardTitle>Revenue Trends</CardTitle>
				<CardDescription>Revenue trends in the last 6 months</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 20,
							left: 12,
							right: 12
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>

						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => `₱${value}`}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Line
							dataKey="revenue"
							type="natural"
							stroke="var(--color-revenue)"
							strokeWidth={2}
							dot={{
								fill: "var(--color-revenue)"
							}}
							activeDot={{
								r: 6
							}}
						></Line>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
