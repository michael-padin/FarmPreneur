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

const data = [
	{ name: "Jan", orders: 400, revenue: 2400 },
	{ name: "Feb", orders: 300, revenue: 1398 },
	{ name: "Mar", orders: 200, revenue: 9800 },
	{ name: "Apr", orders: 278, revenue: 3908 },
	{ name: "May", orders: 189, revenue: 4800 },
	{ name: "Jun", orders: 239, revenue: 3800 }
]

const chartData = [
	{ month: "January", orders: 186, revenue: 80 },
	{ month: "February", orders: 305, revenue: 200 },
	{ month: "March", orders: 237, revenue: 120 },
	{ month: "April", orders: 73, revenue: 190 },
	{ month: "May", orders: 209, revenue: 130 },
	{ month: "June", orders: 214, revenue: 140 }
]
const chartConfig = {
	orders: {
		label: "Orders",
		color: "hsl(var(--chart-1))"
	},
	mobile: {
		label: "Mobile",
		color: "hsl(var(--chart-2))"
	}
} satisfies ChartConfig

interface OrderTrendsProps {
	dateRange: DateRange | undefined
}
export function OrderTrends({ dateRange }: OrderTrendsProps) {
	return (
		<Card className="col-span-2">
			<CardHeader>
				<CardTitle>Order Trends</CardTitle>
				<CardDescription>Trend of orders in the last 6 months</CardDescription>
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
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => `${value}`}
						/>
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Line
							dataKey="orders"
							type="natural"
							stroke="var(--color-orders)"
							strokeWidth={2}
							dot={{
								fill: "var(--color-orders)"
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
