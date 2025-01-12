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
import { Label, Pie, PieChart } from "recharts"

const chartData = [
	{ category: "readyToCook", products: 2, fill: "var(--color-readyToCook)" },
	{ category: "vegetables", products: 20, fill: "var(--color-vegetables)" },
	{ category: "fruits", products: 10, fill: "var(--color-fruits)" },
	{
		category: "nutsAndSeeds",
		products: 0,
		fill: "var(--color-nutsAndSeeds)"
	},
	{ category: "other", products: 0, fill: "var(--color-other)" }
]
const chartConfig = {
	products: {
		label: "Products"
	},
	readyToCook: {
		label: "Ready to cook",
		color: "hsl(var(--chart-1))"
	},
	vegetables: {
		label: "Vegetables",
		color: "hsl(var(--chart-2))"
	},
	fruits: {
		label: "Fruits",
		color: "hsl(var(--chart-3))"
	},
	nutsAndSeeds: {
		label: "Nuts & Seeds",
		color: "hsl(var(--chart-4))"
	},
	other: {
		label: "Other",
		color: "hsl(var(--chart-5))"
	}
} satisfies ChartConfig
interface ProductCategoryDistributionProps {
	dateRange: DateRange | undefined
}

export function ProductCategoryDistribution({
	dateRange
}: ProductCategoryDistributionProps) {
	const totalProducts = 32
	return (
		<Card className="flex flex-col">
			<CardHeader className="pb-0">
				<CardTitle className="text-base tracking-tight">
					Product Category Distribution
				</CardTitle>
				<CardDescription className="">
					Number of products in each category
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey="products"
							nameKey="category"
							innerRadius={60}
							strokeWidth={5}
							labelLine={false}
							label={({ payload, ...props }) => {
								return (
									<text
										cx={props.cx}
										cy={props.cy}
										x={props.x}
										y={props.y}
										textAnchor={props.textAnchor}
										dominantBaseline={props.dominantBaseline}
										fill="hsla(var(--foreground))"
									>
										{payload.products}
									</text>
								)
							}}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
												>
													{totalProducts.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Products
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
