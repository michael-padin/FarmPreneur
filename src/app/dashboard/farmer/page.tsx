import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { Dashboard } from "./_components/client2"

const getUserFarmer = async (id: string) => {
	const res = await getUserFarmerByIdUseCase(id)
	return res
}

export default async function FarmerDashboard() {
	return <Dashboard />
}
