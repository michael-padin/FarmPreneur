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
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

const chartData = [
	{ status: "pending", orders: 3, fill: "var(--color-pending)" },
	{ status: "inProgress", orders: 30, fill: "var(--color-inProgress)" },
	{ status: "completed", orders: 14, fill: "var(--color-completed)" },
	{ status: "cancelled", orders: 8, fill: "var(--color-cancelled)" }
]
const chartConfig = {
	orders: {
		label: "Orders"
	},
	pending: {
		label: "Pending",
		color: "hsl(var(--chart-1))"
	},
	inProgress: {
		label: "In Progress",
		color: "hsl(var(--chart-2))"
	},
	completed: {
		label: "Completed",
		color: "hsl(var(--chart-3))"
	},
	cancelled: {
		label: "Cancelled",
		color: "hsl(var(--chart-4))"
	},
	other: {
		label: "Other",
		color: "hsl(var(--chart-5))"
	}
} satisfies ChartConfig

interface OrderStatusOverviewProps {
	dateRange: DateRange | undefined
}

export function OrderStatusOverview({ dateRange }: OrderStatusOverviewProps) {
	return (
		<Card className="">
			<CardHeader>
				<CardTitle className="text-base">Order Status Overview</CardTitle>
				<CardDescription>Number of orders in each status</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="status"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) =>
								chartConfig[value as keyof typeof chartConfig]?.label
							}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							dataKey="orders"
							strokeWidth={2}
							radius={8}
							activeIndex={2}
							activeBar={({ ...props }) => {
								return (
									<Rectangle
										{...props}
										fillOpacity={0.8}
										stroke={props.payload.fill}
										strokeDasharray={4}
										strokeDashoffset={4}
									/>
								)
							}}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
