"use server"
import { verifySession } from "@/lib/dal"
import { db } from "@/lib/db"
import { getErrorMessage } from "@/lib/handle-error"
import { pusherServer } from "@/lib/pusher"
import { isDevelopment } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { Message } from "react-hook-form"

export const sendMessage = async (data: {
	content: string
	fileUrl?: string | null
	senderId: string
	receiverId: string
	receiverRole: string
	senderRole: string
	fileType?: "image" | "video"
	replyToId?: string | null
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

		// Trigger Pusher event for real-time updates
		if (!isDevelopment) {
			await pusherServer.trigger(
				`chat-${userId}-${data.receiverId}`,
				"new-message",
				message
			)
			await pusherServer.trigger(`user-${data.receiverId}`, "new-message", {
				conversation: {
					id: userId,
					lastMessage: message
				}
			})
		}

		revalidatePath(`/messages/${data.receiverId}`)
		revalidatePath("/messages")

		return { success: true, message }
	} catch (error) {
		return { success: false, error: getErrorMessage(error) }
	}
}
