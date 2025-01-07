"use server"
import { verifySession } from "@/lib/dal"
import { db } from "@/lib/db"
import { getErrorMessage } from "@/lib/handle-error"
import { pusherServer } from "@/lib/pusher"
import { Message, ROLE } from "@prisma/client"
import { notifyNewMessage } from "./notifications"

export const sendMessage = async (data: {
	content: string
	fileUrl?: string | null
	senderId: string
	receiverId: string
	receiverRole: ROLE
	senderRole: ROLE
	fileType?: "image" | "video"
	replyToId?: string
	replyTo?: Message | null
}) => {
	const { userId } = await verifySession()
	try {
		const message = await db.message.create({
			data: {
				content: data.content,
				senderId: userId,
				receiverId: data.receiverId,
				replyToId: data.replyToId,
				fileType: data.fileType,
				fileUrl: data.fileUrl
			},
			include: {
				sender: {
					include: {
						customer: true,
						farmer: true
					}
				}
			}
		})

		if (!message) {
			return { success: false, message: "Failed to create message" }
		}

		await notifyNewMessage({
			...data
		})

		// Trigger Pusher event for real-time updates
		await pusherServer.trigger(
			`chat-${userId}-${data.receiverId}`,
			"new-message",
			message
		)
		await pusherServer.trigger(
			`chat-${data.receiverId}-${userId}`,
			"new-message",
			message
		)

		await pusherServer.trigger(`user-${data.receiverId}`, "new-message", {
			conversation: {
				id: userId,
				lastMessage: message
			}
		})
		await pusherServer.trigger(`user-${userId}`, "new-message", {
			conversation: {
				id: userId,
				lastMessage: message
			}
		})

		// revalidatePath(`/messages`)
		// revalidatePath(`/messages/${data.senderId}`)
		// revalidatePath(`/dashboard/farmer/messages`)
		// revalidatePath(`/dashboard/farmer/messages/${data.senderId}`)
		// revalidatePath("/messages")

		return { success: true, message }
	} catch (error) {
		return { success: false, error: getErrorMessage(error) }
	}
}
