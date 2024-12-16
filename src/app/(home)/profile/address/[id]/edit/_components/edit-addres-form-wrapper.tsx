import { getAddressById } from "@/use-cases/address"
import { notFound } from "next/navigation"
import { CustomerEditAddressForm } from "./edit-address-form."
type Params = Promise<{ id: string }>

export async function EditAddressFormWrapper({ params }: { params: Params }) {
	const id = (await params).id

	if (!id) {
		notFound()
	}

	const address = await getAddressById(id)
	return <CustomerEditAddressForm address={address} />
}
