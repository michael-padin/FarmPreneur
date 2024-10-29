import { UpdateUser } from "./types"

export const updateUser = async (data: {
	data: UpdateUser & {
		id: string
		farmDetailsId: string
	}
}) => {}
