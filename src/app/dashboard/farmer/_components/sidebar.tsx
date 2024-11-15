"use client"

import { Session } from "next-auth"
import { DashboardSidebar } from "../../_components/sidebar"
import { farmerNavItems } from "@/constants/navItems"

interface FarmerSidebarProps {
	user: Session["user"] | undefined
}
export function FarmerSidebar({ user }: FarmerSidebarProps) {
	return <DashboardSidebar user={user} items={farmerNavItems} />
}
