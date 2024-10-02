import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

interface DashboardLayoutProps {
	farmer: React.ReactNode
	admin: React.ReactNode
}

const DashboardLayout = async ({ farmer, admin }: DashboardLayoutProps) => {
	const session = await auth()

	if (!session) {
		redirect("/login")
	}

	const role = session?.user.role

	return <div>{role === "FARMER" ? farmer : admin}</div>
}

export default DashboardLayout
