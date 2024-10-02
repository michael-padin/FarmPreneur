import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { Dashboard } from "./_components/client2"

const getUserFarmer = async (id: string) => {
	const res = await getUserFarmerByIdUseCase(id)
	return res
}

export default async function FarmerDashboard() {
	const session = await auth()
	if (!session) redirect("/login")

	const farmer = await getUserFarmer(session.user.id!)

	console.log(farmer)

	if (!farmer) redirect("/login")

	if (!session?.user.isApproved) redirect("/admin-approval")
	return <Dashboard />
}
