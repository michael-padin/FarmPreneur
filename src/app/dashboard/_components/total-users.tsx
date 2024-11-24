import { getTotalUsersUseCase } from "@/use-cases/users"
import { StatsCard } from "./stats-card"
import { Users } from "lucide-react"

export async function TotalUsers() {
	const { totalUsers, increaseChange } = await getTotalUsersUseCase()
	return (
		<StatsCard
			Icon={Users}
			title="Total Users"
			total={totalUsers}
			footerText={`+${increaseChange} from last month`}
		/>
	)
}
