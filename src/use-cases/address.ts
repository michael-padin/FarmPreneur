import { Address } from "@/app/dashboard/@admin/users/types"
import { upsertAddress } from "@/data-access/address"

export const upsertAddressUseCase = async (
	data: Address & { userId: string; id: string }
) => {
	return await upsertAddress(data)
}
