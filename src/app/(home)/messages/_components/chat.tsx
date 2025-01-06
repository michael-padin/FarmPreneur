"use client"

import { pusherClient } from "@/lib/pusher"
import {
	Customer,
	Farmer,
	Message as MessageType,
	ROLE,
	User
} from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { ChatForm } from "./chat-form"
import { Message } from "./message"

interface ChatProps {
	currentUserId: string
	currentRole: ROLE
	otherUser: User & {
		farmer?: Farmer | null
	}
	initialMessages: (MessageType & {
		sender: User & {
			customer?: Customer | null
			farmer?: Farmer | null
		}
	})[]
}

export function Chat({
	currentUserId,
	currentRole,
	otherUser,
	initialMessages
}: ChatProps) {
	const [messages, setMessages] = useState(initialMessages)
	const [replyingTo, setReplyingTo] = useState<string | null>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const otherUserDetails = otherUser.farmer

	useEffect(() => {
		if (messages) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({
					behavior: "smooth"
				})
			}, 100)
		}
	}, [messages])

	useEffect(() => {
		const channel = pusherClient.subscribe(
			`chat-${currentUserId}-${otherUser.id}`
		)

		channel.bind(
			"new-message",
			(
				data: MessageType & {
					sender: User & {
						customer?: Customer
						farmer?: Farmer
					}
				}
			) => {
				setMessages((prevMessages) => [...prevMessages, data])
			}
		)

		// channel.bind("new-reaction", (data: { messageId: string }) => {
		// 	setMessages((prevMessages) =>
		// 		prevMessages.map((message) =>
		// 			message.id === data.messageId
		// 				? { ...message, reactions: [...message.reactions] }
		// 				: message
		// 		)
		// 	)
		// })

		return () => {
			pusherClient.unsubscribe(`chat-${currentUserId}-${otherUser.id}`)
		}
	}, [currentUserId, otherUser.id])

	const handleReply = (messageId: string) => {
		setReplyingTo(messageId)
	}

	// const handleReact = async (messageId: string, emoji: string) => {
	// 	try {
	// 		const response = await fetch("/api/reactions", {
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json" },
	// 			body: JSON.stringify({ messageId, emoji, userId: currentUserId })
	// 		})

	// 		if (!response.ok) {
	// 			throw new Error("Failed to add reaction")
	// 		}
	// 	} catch (error) {
	// 		console.error("Error adding reaction:", error)
	// 	}
	// }

	return (
		<>
			<div className="flex h-full flex-col bg-gray-100">
				<div className="flex-1 overflow-y-auto p-2">
					{messages.map((message) => (
						<Message
							key={message.id}
							message={message}
							currentUserId={currentUserId}
							onReply={handleReply}
							// onReact={handleReact}
						/>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0 w-full">
				{replyingTo && (
					<div className="mb-2 flex items-center bg-green-50 p-3 text-sm text-muted-foreground">
						<span className="mr-2">Replying to:</span>
						<span className="flex-1 truncate font-medium">
							{messages.find((m) => m.id === replyingTo)?.content.slice(0, 50)}
							...
						</span>
						<button
							type="button"
							onClick={() => setReplyingTo(null)}
							className="ml-2 text-red-500 hover:text-red-700"
						>
							Cancel
						</button>
					</div>
				)}
				<ChatForm
					senderId={currentUserId}
					receiverId={otherUser.id}
					receiverRole={ROLE.FARMER}
					replyToId={replyingTo}
					senderRole={ROLE.CUSTOMER}
				/>
			</div>
		</>
	)
}
