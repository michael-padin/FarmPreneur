"use client"
import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import { getUserByIdUseCase } from "@/use-cases/users"
import { ROLE } from "@prisma/client"
import { use } from "react"
import AdminForm from "./forms/admin-form"
import CustomerForm from "./forms/customer-form"
import FarmerForm from "./forms/farmer-form"

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
					{ href: "/dashboard/users", label: "All" },
					{ label: "Edit Admin" }
				]
		}
	}
	const breadcrumbItems = [...getBreadcrumbItems(user.role)]

	const FormComponent = {
		CUSTOMER: CustomerForm,
		FARMER: FarmerForm,
		ADMIN: AdminForm
	}[user.role]

	return (
		<>
			<FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={3} />
			<div className="mx-auto max-w-screen-md">
				<FormComponent user={user} />
			</div>
		</>
	)
}
