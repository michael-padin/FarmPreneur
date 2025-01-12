import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"
import { db } from "@/lib/db"

const getFarmerName = async (id: string) => {
	return await db.farmer.findUnique({
		where: {
			id: id
		},
		select: {
			name: true
		}
	})
}
type Params = Promise<{ id: string }>

export async function BreadcrumbWrapper(props: { params: Params }) {
	const params = await props.params
	const farmer = await getFarmerName(params.id)

	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/dashboard/users", label: "Users" },
		{ label: "Farmers", href: "/dashboard/users/farmers" },
		{ label: farmer?.name || "Farmer" }
	]

	return <FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={3} />
}
