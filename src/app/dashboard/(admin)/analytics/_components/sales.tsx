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
	{ month: "January", orders: 186, sales: 80 },
	{ month: "February", orders: 305, sales: 200 },
	{ month: "March", orders: 237, sales: 120 },
	{ month: "April", orders: 73, sales: 190 },
	{ month: "May", orders: 209, sales: 130 },
	{ month: "June", orders: 214, sales: 140 }
]
const chartConfig = {
	sales: {
		label: "Sales",
		color: "hsl(var(--chart-3))"
	},
	orders: {
		label: "Orders",
		color: "hsl(var(--chart-2))"
	}
} satisfies ChartConfig

interface OrderTrendsProps {
	dateRange: DateRange | undefined
}
export function SalesTrends({ dateRange }: OrderTrendsProps) {
	return (
		<Card className="col-span-2">
			<CardHeader>
				<CardTitle>Sales Trends</CardTitle>
				<CardDescription>Sales Trends in the last 6 months</CardDescription>
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
							tickFormatter={(value) => `${value}`}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Line
							dataKey="sales"
							type="natural"
							stroke="var(--color-sales)"
							strokeWidth={2}
							dot={{
								fill: "var(--color-sales)"
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
