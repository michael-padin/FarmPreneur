"use server"
import { getErrorMessage } from "@/lib/handle-error"
import { pusherServer } from "@/lib/pusher"
import { getPendingFarmerCountUseCase } from "@/use-cases/farmers"
import { createNotificationsForAdminsUseCase } from "@/use-cases/notifications"
import { createUserFarmerByIdUseCase } from "@/use-cases/users"
import { FarmRegistrationSchema } from "./types"

export const upsertFarmerAction = async (
	data: FarmRegistrationSchema & { userId: string }
) => {
	try {
		const createdFarmer = await createUserFarmerByIdUseCase({
			...data
		})

		if (createdFarmer.applicationStatus === "PENDING") {
			await pusherServer.trigger("pending-farmers-count", "update", {
				count: await getPendingFarmerCountUseCase()
			})

			await createNotificationsForAdminsUseCase({
				title: "Farmer Approval",
				message: `A new farmer has registered`,
				type: "FARMER_APPROVAL",
				metadata: {
					user: {
						userId: createdFarmer.userId,
						name: createdFarmer.farmName || ""
					}
				}
			})

			await pusherServer.trigger("pending-farmers", "update", {
				data: createdFarmer
			})
		}

		return { error: null }
	} catch (error) {
		console.log("error :>> ", error)
		return { error: getErrorMessage(error) }
	}
}
