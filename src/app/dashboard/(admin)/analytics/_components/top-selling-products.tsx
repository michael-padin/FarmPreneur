"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRange } from "react-day-picker"
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts"

const data = [
	{ name: "Apples", sales: 4000 },
	{ name: "Tomatoes", sales: 3000 },
	{ name: "Milk", sales: 2000 },
	{ name: "Eggs", sales: 2780 },
	{ name: "Bread", sales: 1890 }
]

interface TopSellingProductsProps {
	dateRange: DateRange | undefined
}

export function TopSellingProducts({ dateRange }: TopSellingProductsProps) {
	return (
		<Card className="col-span-3">
			<CardHeader>
				<CardTitle>Top Selling Products</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							layout="vertical"
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis type="number" />
							<YAxis dataKey="name" type="category" />
							<Tooltip />
							<Legend />
							<Bar dataKey="sales" fill="hsl(var(--primary))" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	)
}
