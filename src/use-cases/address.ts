import { Address } from "@/app/dashboard/(admin)/users/(lists)/types"

export const upsertAddressUseCase = async (
	data: Address & { userId: string; id: string }
) => {
	// return await upsertAddress(data)
}
