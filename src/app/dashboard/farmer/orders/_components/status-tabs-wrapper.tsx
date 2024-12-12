import { getFarmerOrderCountUseCase } from "@/use-cases/orders"
import { StatusTabs } from "./status-tabs"

export async function StatusTabsWrapper() {
	const ordersCount = await getFarmerOrderCountUseCase()

	return <StatusTabs count={ordersCount} />
}
