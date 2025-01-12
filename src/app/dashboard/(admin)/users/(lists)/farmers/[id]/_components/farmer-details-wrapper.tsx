import { getFarmerById } from "@/data-access/farmers"
import FarmerDetails from "./farm-details"

type Params = Promise<{ id: string }>

export async function FarmerDetailsWrapper(props: { params: Params }) {
	const params = await props.params

	const farmer = await getFarmerById(params.id)

	return <FarmerDetails farmer={farmer} />
}
