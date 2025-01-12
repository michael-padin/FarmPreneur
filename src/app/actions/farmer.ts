"use server"
import { verifyAdminSession } from "@/lib/dal"
import { db } from "@/lib/db"
import { getErrorMessage } from "@/lib/handle-error"
import { revalidatePath } from "next/cache"
import { notifyFarmerApproval } from "./notifications"

export const rejectFarmer = async ({
	farmerId,
	rejectionReason
}: {
	farmerId: string
	rejectionReason: string
}) => {
	await verifyAdminSession()

	if (!farmerId) {
		return { error: "Farmer ID is required", data: null }
	}

	if (!rejectionReason) {
		return { error: "Rejection reason is required", data: null }
	}

	try {
		await db.farmer.update({
			where: {
				id: farmerId
			},
			data: {
				applicationRejection: rejectionReason,
				applicationStatus: "REJECTED"
			}
		})

		await notifyFarmerApproval(farmerId, false, rejectionReason)
		revalidatePath("/dashboard/farmer/application-status")
		revalidatePath("/dashboard/farmer/profile")
		revalidatePath("/dashboard/farmer")

		return {
			data: null,
			error: null
		}
	} catch (error) {
		return { error: getErrorMessage(error), data: null }
	}
}

export const approveFarmer = async (prevState: any, farmerId: string) => {
	if (!farmerId) {
		return { error: "Farmer ID is required", data: null }
	}

	try {
		await db.farmer.update({
			where: {
				id: farmerId
			},
			data: {
				applicationStatus: "APPROVED"
			}
		})

		await notifyFarmerApproval(farmerId, true)
		revalidatePath("/dashboard/farmer/application-status")
		revalidatePath("/dashboard/farmer/profile")
		revalidatePath("/dashboard/farmer")
		revalidatePath(`/dashboard/users/farmers/${farmerId}`)

		return {
			data: null,
			error: null
		}
	} catch (error) {
		return { error: getErrorMessage(error), data: null }
	}
}
