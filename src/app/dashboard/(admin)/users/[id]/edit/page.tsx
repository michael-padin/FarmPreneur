import { getUserByIdUseCase } from "@/use-cases/users"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { BackButton } from "@/components/fg/back-button"
import { EditUserSkeleton } from "./_components/edit-user-skeleton"
import { FormComponentWrapper } from "./_components/form-component-wrapper"

const getUser = async (id: string) => {
	return await getUserByIdUseCase(id)
}

// After
type Params = Promise<{ id: string }>

export default async function EditUserPage(props: { params: Params }) {
	const session = await auth()

	if (!session || session.user.role !== "ADMIN") redirect("/login")

	const params = await props.params
	const promiseUser = getUser(params.id)

	return (
		<div className="space-y-2 p-2 lg:space-y-4 lg:p-5">
			<BackButton type="button" variant="secondary" className="rounded-full" />
			<Suspense fallback={<EditUserSkeleton />}>
				<FormComponentWrapper promiseUser={promiseUser} />
			</Suspense>
		</div>
	)
}
