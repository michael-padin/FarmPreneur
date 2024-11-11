import { getUserByIdUseCase } from "@/use-cases/users"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import CustomerForm from "./_components/forms/customer-form"
import FarmerForm from "./_components/forms/farmer-form"
import AdminForm from "./_components/forms/admin-form"
import { Suspense } from "react"

const getUser = async (id: string) => {
	return await getUserByIdUseCase(id)
}

// After
type Params = Promise<{ id: string }>

export default async function EditUserPage(props: { params: Params }) {
	const session = await auth()

	if (!session || session.user.role !== "ADMIN") redirect("/login")

	const params = await props.params
	const user = await getUser(params.id)

	if (!user) return notFound()

	const FormComponent = {
		CUSTOMER: CustomerForm,
		FARMER: FarmerForm,
		ADMIN: AdminForm
	}[user.role]

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<FormComponent user={user} />
		</Suspense>
	)
}
