"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { pusherClient } from "@/lib/pusher"
import { Customer, Farmer, Message, ROLE, User } from "@prisma/client"
import Link from "next/link"
import { useEffect, useState, useTransition } from "react"

type ConversationPartner = User & {
	customer?: Customer | null
	farmer?: Farmer | null
	lastMessage: Message & {
		sender: User & {
			customer?: Customer | null
			farmer?: Farmer | null
		}
	}
}

interface MessageListProps {
	currentUserId: string
	role: ROLE
	initialConversations: ConversationPartner[]
}

export function MessageList({
	currentUserId,
	role,
	initialConversations
}: MessageListProps) {
	const [conversations, setConversations] = useState(initialConversations)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		const channel = pusherClient.subscribe(`user-${currentUserId}`)

		channel.bind(
			"new-message",
			(data: { conversation: ConversationPartner }) => {
				setConversations((prevConversations) => {
					const existingConversationIndex = prevConversations.findIndex(
						(conv) => conv.id === data.conversation.id
					)

					if (existingConversationIndex !== -1) {
						const updatedConversations = [...prevConversations]
						updatedConversations[existingConversationIndex] = data.conversation
						return [
							updatedConversations[existingConversationIndex],
							...updatedConversations.filter(
								(_, index) => index !== existingConversationIndex
							)
						]
					} else {
						return [data.conversation, ...prevConversations]
					}
				})
			}
		)

		return () => {
			pusherClient.unsubscribe(`user-${currentUserId}`)
		}
	}, [currentUserId])

	// useEffect(() => {
	// 	const lastConversation = conversations[conversations.length - 1]
	// 	if (lastConversation) {
	// 		const observer = new IntersectionObserver(
	// 			(entries) => {
	// 				if (entries[0].isIntersecting) {
	// 					startTransition(async () => {
	// 						const moreConversations = await fetchMoreConversations(
	// 							lastConversation.id,
	// 							currentUserId
	// 						)
	// 						setConversations((prev) => [...prev, ...moreConversations])
	// 					})
	// 				}
	// 			},
	// 			{ threshold: 1 }
	// 		)

	// 		observer.observe(
	// 			document.getElementById(`conversation-${lastConversation.id}`)!
	// 		)

	// 		return () => observer.disconnect()
	// 	}
	// }, [conversations, fetchMoreConversations])

	return (
		<div className="">
			{conversations.length > 0 &&
				conversations.map((conversation) => {
					const partnerDetails = conversation.customer
					return (
						<Link
							key={conversation.id + "sd"}
							id={`conversation-${conversation.id}`}
							href={`/dashboard/farmer/messages/${conversation.customer?.userId}/`}
							className="flex items-center p-4 transition-colors hover:bg-gray-50"
						>
							<Avatar className="mr-4 flex h-[50px] w-[50px] items-center justify-center bg-background">
								<AvatarImage
									src={partnerDetails?.profilePicture || "/placeholder.png"}
								/>
								<AvatarFallback className="text-primary">
									{partnerDetails?.name?.charAt(0)}
								</AvatarFallback>
								<span className="sr-only">{partnerDetails?.name}</span>
							</Avatar>
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between">
									<h2 className="truncate text-lg font-semibold">
										{partnerDetails?.name || "Unknown"}
									</h2>

									{/* <span className="text-xs text-gray-500">
										{formatDistanceToNow(conversation.lastMessage.createdAt, {
											addSuffix: true
										})}
									</span> */}
								</div>
								<div className="flex items-center justify-between gap-2">
									<p className="truncate text-muted-foreground">
										{conversation.lastMessage.senderId === currentUserId
											? "You: "
											: ""}
										{conversation.lastMessage.content}
									</p>
									<div className="text-xs text-muted-foreground">
										<time className="block w-max text-xs font-normal leading-none text-muted-foreground">
											{new Date(
												conversation.lastMessage.createdAt
											).toLocaleString()}
										</time>
									</div>
								</div>
							</div>
						</Link>
					)
				})}
			{/* {isPending && (
				<div className="p-4 text-center">Loading more conversations...</div>
			)} */}
		</div>
	)
}
