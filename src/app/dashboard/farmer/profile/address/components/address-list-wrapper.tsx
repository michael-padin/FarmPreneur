import { getFarmerAddressListUseCase } from "@/use-cases/address"
import { AddressList } from "./address-list"

export async function AddressListWrapper() {
	const addressList = await getFarmerAddressListUseCase()

	return <AddressList addressList={addressList} />
}
