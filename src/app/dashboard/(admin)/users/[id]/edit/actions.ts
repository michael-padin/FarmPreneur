"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { editUserSchema, EditUserSchema } from "./_components/validations"
import { updateCustomerByUserIdUseCase } from "@/use-cases/customers"
import {
	getPendingFarmerCountUseCase,
	updateFarmerByUserIdUseCase
} from "@/use-cases/farmers"
import { pusherServer } from "@/lib/pusher"

export const updateCustomer = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	const validatedFields = editUserSchema.safeParse(data)

	if (!validatedFields.success) {
		return {
			error: "Invalid fields"
		}
	}
	try {
		await updateCustomerByUserIdUseCase(data)
		return { error: null, success: true }
	} catch (error) {
		return {
			error: getErrorMessage(error)
		}
	}
}

export const updateFarmer = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	const validatedFields = editUserSchema.safeParse(data)

	if (!validatedFields.success) {
		return {
			error: "Invalid fields"
		}
	}
	try {
		/**
		 * @
		 * @todo - if verification document is updated - remove the current one in s3 storage
		 */
		const updateFarmer = await updateFarmerByUserIdUseCase(data)

		/**
		 * @todo - update the pending farmer count
		 */
		if (updateFarmer.applicationStatus === "PENDING") {
			await pusherServer.trigger("pending-farmers-count", "update", {
				count: await getPendingFarmerCountUseCase()
			})
		}

		/**
		 * @todo - if application status is rejected email the farmer with a rejection message
		 * @todo - if application status is approved email the farmer with a congratulations message
		 */

		return { error: null, success: true }
	} catch (error) {
		console.log("error :>> ", error)
		return {
			error: getErrorMessage(error)
		}
	}
}

export const updateAdmin = async (
	data: EditUserSchema & {
		userId: string
	}
) => {
	const validatedFields = editUserSchema.safeParse(data)

	if (!validatedFields.success) {
		return {
			error: "Invalid fields"
		}
	}
}
