import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

interface DashboardLayoutProps {
	farmer: React.ReactNode
	admin: React.ReactNode
}

const DashboardLayout = async ({ farmer, admin }: DashboardLayoutProps) => {
	const session = await auth()

	if (!session || !["FARMER", "ADMIN"].includes(session?.user.role)) {
		redirect("/login")
	}

	const role = session?.user.role

	return <div>{role === "ADMIN" ? farmer : admin}</div>
}

export default DashboardLayout
