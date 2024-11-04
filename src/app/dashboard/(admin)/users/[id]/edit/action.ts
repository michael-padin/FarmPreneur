import { UpdateUserSchema } from "./types"

export const updateUser = async (data: {
	data: UpdateUserSchema & {
		id: string
		farmDetailsId: string
	}
}) => {}
