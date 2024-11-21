import { DashboardHeader } from "@/app/_components/header"
import { DashUI } from "../_components/dash-ui"
import DashUI2 from "../_components/dash-ui-2"
import DashUI3 from "../_components/dash-ui-3"

export default async function AdminDashboardPage() {
	return (
		<div className="">
			<DashboardHeader />
			<DashUI3 />
		</div>
	)
}
