import { getCustomerOrderCountUseCase } from "@/use-cases/orders"
import { StatusTabs } from "./status-tabs"

export async function StatusTabsWrapper() {
	const ordersCount = await getCustomerOrderCountUseCase()

	return <StatusTabs count={ordersCount} />
}
