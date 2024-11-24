import { StatsCard } from "./stats-card"
import { ShoppingCart } from "lucide-react"
import { getTotalOrdersUseCase } from "@/use-cases/orders"

export async function TotalOrders() {
	const { totalOrders, increaseChange } = await getTotalOrdersUseCase()

	return (
		<StatsCard
			Icon={ShoppingCart}
			title="Total Orders"
			total={totalOrders}
			footerText={`+${increaseChange} from last month`}
		/>
	)
}
