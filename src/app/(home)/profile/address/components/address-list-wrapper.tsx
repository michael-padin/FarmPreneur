import { getCustomerAddressListUseCase } from "@/use-cases/address"
import { AddressList } from "./address-list"

export async function AddressListWrapper() {
	const addressList = await getCustomerAddressListUseCase()

	return <AddressList addressList={addressList} />
}
