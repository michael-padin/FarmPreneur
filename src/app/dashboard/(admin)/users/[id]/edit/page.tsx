import { getUserByIdUseCase } from "@/use-cases/users"
import UserDetailsForm from "./_components/user-details-form"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { getFarmDetailsByUserIdUseCase } from "@/use-cases/farm-details"

const getUser = async (id: string) => {
	return await getUserByIdUseCase(id)
}
const getFarmerDetails = async (id: string) => {
	return await getFarmDetailsByUserIdUseCase(id)
}

// After
type Params = Promise<{ id: string }>

const EditUserDetailsPage = async (props: { params: Params }) => {
	const session = await auth()

	if (!session || session.user.role !== "ADMIN") {
		redirect("/login")
	}

	const params = await props.params

	const [user, farmDetails] = await Promise.all([
		getUser(params.id),
		getFarmerDetails(params.id)
	])

	if (!user) {
		notFound()
	}

	return <UserDetailsForm user={user} farmDetails={farmDetails} />
}
export default EditUserDetailsPage
