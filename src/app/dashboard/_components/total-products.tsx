import { StatsCard } from "./stats-card"
import { Package } from "lucide-react"
import { getTotalProductsUseCase } from "@/use-cases/products"

export async function TotalProducts() {
	const { totalProducts, increaseChange } = await getTotalProductsUseCase()

	return (
		<StatsCard
			Icon={Package}
			title="Total Products"
			total={totalProducts}
			footerText={`+${increaseChange} from last month`}
		/>
	)
}
