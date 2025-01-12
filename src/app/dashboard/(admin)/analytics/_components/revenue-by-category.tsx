"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip
} from "recharts"

const data = [
	{ name: "Fruits", value: 400 },
	{ name: "Vegetables", value: 300 },
	{ name: "Dairy", value: 300 },
	{ name: "Grains", value: 200 }
]

const COLORS = [
	"hsl(var(--primary))",
	"hsl(var(--secondary))",
	"hsl(var(--accent))",
	"hsl(var(--muted))"
]

export function RevenueByCategory() {
	return (
		<Card className="col-span-3">
			<CardHeader>
				<CardTitle>Revenue by Category</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								labelLine={false}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	)
}
