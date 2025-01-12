"use client"

import { LabelList, Pie, PieChart } from "recharts"

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
const chartData = [
	{ role: "admin", users: 1, fill: "var(--color-admin)" },
	{ role: "farmer", users: 14, fill: "var(--color-farmer)" },
	{ role: "customer", users: 12, fill: "var(--color-customer)" }
]

const chartConfig = {
	users: {
		label: "Users"
	},
	admin: {
		label: "Admin",
		color: "hsl(var(--chart-1))"
	},
	farmer: {
		label: "Farmer",
		color: "hsl(var(--chart-2))"
	},
	customer: {
		label: "Customer",
		color: "hsl(var(--chart-3))"
	}
} satisfies ChartConfig

interface UserRoleDistributionProps {
	dateRange: DateRange | undefined
}

export function UserRoleDistribution({ dateRange }: UserRoleDistributionProps) {
	// This is a mock function to simulate data fetching and filtering
	const getFilteredData = (range: DateRange | undefined) => {
		// In a real application, you would fetch data from an API
		// and filter it based on the date range
		const allData = [
			{ name: "Farmers", value: 400 },
			{ name: "Customers", value: 1500 },
			{ name: "Admins", value: 50 }
		]

		if (!range || !range.from || !range.to) {
			return allData
		}

		// This is a placeholder for actual data filtering logic
		return allData.map((item) => ({
			...item,
			value: Math.floor(item.value * Math.random() * 0.5 + item.value * 0.5)
		}))
	}

	const data = getFilteredData(dateRange)
	return (
		<Card className="flex flex-col">
			<CardHeader className="">
				<CardTitle className="text-base">User Role Distribution</CardTitle>
				<CardDescription className="">
					Number of users in each role
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
				>
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<Pie data={chartData} dataKey="users" label nameKey="role">
							<LabelList
								dataKey="role"
								className="fill-background"
								stroke="none"
								fontSize={12}
								formatter={(value: keyof typeof chartConfig) =>
									chartConfig[value]?.label
								}
							/>
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="role" />}
							className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
