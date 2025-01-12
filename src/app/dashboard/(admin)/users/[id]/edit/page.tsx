import { auth } from "@/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserByIdUseCase } from "@/use-cases/users"
import { redirect } from "next/navigation"
import { Suspense } from "react"
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
		<div className="space-y-4 px-4 py-5 lg:px-5">
			<Suspense
				fallback={
					<div>
						<Skeleton className="h-6 w-40 bg-background" />
						<div className="mx-auto max-w-screen-md">
							<EditUserSkeleton />
						</div>
					</div>
				}
			>
				<FormComponentWrapper promiseUser={promiseUser} />
			</Suspense>
		</div>
	)
}
