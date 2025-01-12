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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from "@/components/ui/chart"
import { DateRange } from "react-day-picker"
import { LabelList, Pie, PieChart } from "recharts"

const chartData = [
	{ status: "pending", farmers: 1, fill: "var(--color-pending)" },
	{ status: "approved", farmers: 14, fill: "var(--color-approved)" },
	{ status: "rejected", farmers: 1, fill: "var(--color-rejected)" }
]

const chartConfig = {
	farmers: {
		label: "Farmers"
	},
	pending: {
		label: "Pending",
		color: "hsl(var(--chart-1))"
	},
	approved: {
		label: "Approved",
		color: "hsl(var(--chart-2))"
	},
	rejected: {
		label: "Rejected",
		color: "hsl(var(--chart-3))"
	}
} satisfies ChartConfig

interface FarmerApplicationStatusProps {
	dateRange: DateRange | undefined
}

export function FarmerApplicationStatus({
	dateRange
}: FarmerApplicationStatusProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Farmer Application Status</CardTitle>
				<CardDescription className="">
					Number of applications in each status
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
				>
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<Pie data={chartData} dataKey="farmers" label nameKey="status">
							<LabelList
								dataKey="status"
								className="fill-background"
								stroke="none"
								fontSize={12}
								formatter={(value: keyof typeof chartConfig) =>
									chartConfig[value]?.label
								}
							/>
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="status" />}
							className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
