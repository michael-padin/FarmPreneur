"use client"
import { getUserByIdUseCase } from "@/use-cases/users"
import { use } from "react"
import CustomerForm from "./forms/customer-form"
import FarmerForm from "./forms/farmer-form"
import AdminForm from "./forms/admin-form"

interface FormComponentWrapperProps {
	promiseUser: Promise<Awaited<ReturnType<typeof getUserByIdUseCase>>>
}
export function FormComponentWrapper({
	promiseUser
}: FormComponentWrapperProps) {
	const user = use(promiseUser)

	const FormComponent = {
		CUSTOMER: CustomerForm,
		FARMER: FarmerForm,
		ADMIN: AdminForm
	}[user.role]

	return <FormComponent user={user} />
}
