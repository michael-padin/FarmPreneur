import { FPBreadcrumbResponsive } from "@/components/fp/fp-breadcrumb"

type Params = Promise<{ id: string }>

export async function BreadcrumbWrapper(props: { params: Params }) {
	const params = await props.params

	const breadcrumbItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/dashboard/orders", label: "Orders" },
		{ label: params.id }
	]

	return <FPBreadcrumbResponsive items={breadcrumbItems} itemsToDisplay={3} />
}
