"use client"
import { getUserByIdUseCase } from "@/use-cases/users"
import { use } from "react"
import CustomerForm from "./forms/customer-form"
import FarmerForm from "./forms/farmer-form"
import AdminForm from "./forms/admin-form"
import { BreadcrumbResponsive } from "@/components/fg/back-button"
import { ROLE } from "@prisma/client"

interface FormComponentWrapperProps {
	promiseUser: Promise<Awaited<ReturnType<typeof getUserByIdUseCase>>>
}
export function FormComponentWrapper({
	promiseUser
}: FormComponentWrapperProps) {
	const user = use(promiseUser)
	const getBreadcrumbItems = (role: ROLE) => {
		switch (role) {
			case "CUSTOMER":
				return [
					{ href: "/dashboard/users", label: "Users" },
					{ href: "/dashboard/users/customers", label: "Customers" },
					{ label: "Edit Customer" }
				]
			case "FARMER":
				return [
					{ href: "/dashboard/users", label: "Users" },
					{ href: "/dashboard/users/farmers", label: "Farmers" },
					{ label: "Edit Farmer" }
				]
			case "ADMIN":
				return [
					{ href: "/dashboard/users", label: "Users" },
					{ label: "Edit Admin" }
				]
		}
	}
	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		...getBreadcrumbItems(user.role)
	]

	const FormComponent = {
		CUSTOMER: CustomerForm,
		FARMER: FarmerForm,
		ADMIN: AdminForm
	}[user.role]

	return (
		<>
			<BreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={4} />
			<div className="mx-auto max-w-screen-md">
				<FormComponent user={user} />
			</div>
		</>
	)
}
