import { getUserByIdUseCase } from "@/use-cases/users"
import UserDetailsForm from "./_components/user-details-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

const getUser = async (id: string) => {
	return await getUserByIdUseCase(id)
}

// After
type Params = Promise<{ id: string }>

const EditUserDetailsPage = async (props: { params: Params }) => {
	const session = await auth()

	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const params = await props.params
	const user = await getUser(params.id)

	return (
		<>
			<UserDetailsForm user={user} />
		</>
	)
}
export default EditUserDetailsPage
