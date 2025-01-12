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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

const chartData = [
	{ month: "January", customers: 186 },
	{ month: "February", customers: 305 },
	{ month: "March", customers: 237 },
	{ month: "April", customers: 73 },
	{ month: "May", customers: 209 },
	{ month: "June", customers: 214 }
]
const chartConfig = {
	customers: {
		label: "Customers",
		color: "hsl(var(--chart-3))"
	}
} satisfies ChartConfig

export function CustomerGrowth() {
	return (
		<Card className="">
			<CardHeader>
				<CardTitle>Customer Growth</CardTitle>
				<CardDescription>Customer growth in the last 6 months</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="max-h-[300px] w-full">
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
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
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Area
							dataKey="customers"
							type="natural"
							fill="var(--color-customers)"
							fillOpacity={0.4}
							stroke="var(--color-customers)"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
