"use server"
import { notifyFarmerApproval } from "@/app/actions/notifications"
import { getErrorMessage } from "@/lib/handle-error"
import { pusherServer } from "@/lib/pusher"
import { updateCustomerByUserIdUseCase } from "@/use-cases/customers"
import {
	getFarmerByUserIdUseCase,
	getPendingFarmerCountUseCase,
	updateFarmerByUserIdUseCase
} from "@/use-cases/farmers"
import { updateAdminUserUseCase } from "@/use-cases/users"
import { editUserSchema, EditUserSchema } from "./validations"

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
		newGovIdImage?: string
		newSelfieWithGovIdImage?: string
	}
) => {
	try {
		/**
		 * @
		 * @todo - if verification document is updated - remove the current one in s3 storage
		 */
		const farmer = await getFarmerByUserIdUseCase(data.userId)
		const updatedFarmer = await updateFarmerByUserIdUseCase(data)

		if (farmer.applicationStatus !== updatedFarmer?.applicationStatus) {
			await pusherServer.trigger("pending-farmers-count", "update", {
				count: await getPendingFarmerCountUseCase()
			})
		}

		if (updatedFarmer?.applicationStatus !== "PENDING") {
			await notifyFarmerApproval(
				updatedFarmer.farmerId!,
				updatedFarmer.applicationStatus === "APPROVED"
			)
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
	try {
		await updateAdminUserUseCase(data)
		return { error: null }
	} catch (error) {
		return { error: getErrorMessage(error) }
	}
}
