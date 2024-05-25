import React from "react"

interface DashboardLayoutProps {
  farmer: React.ReactNode
  admin: React.ReactNode
}

const DashboardLayout = ({ farmer, admin }: DashboardLayoutProps) => {
  const role = "FARMER"

  return <div>{role === "FARMER" ? farmer : admin}</div>
}

export default DashboardLayout
