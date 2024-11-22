import { DashboardHeader } from "@/app/_components/header"
import { DashUI } from "../_components/dash-ui"
import DashUI2 from "../_components/dash-ui-2"
import DashUI3 from "../_components/dash-ui-3"
import { Button } from "@react-email/components"

export default function AdminDashboardPage() {
	return (
		<div className="">
			<DashboardHeader />
			<div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
					<div className="flex items-center space-x-2">
						<Button>Download Report</Button>
					</div>
				</div>
				{/* <DashUI3 /> */}
			</div>
		</div>
	)
}
