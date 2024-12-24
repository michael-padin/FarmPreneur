"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
// import { Message, User } from "@/types"
import { useState } from "react"

export type User = {
	id: string
	name: string
	role: "customer" | "farmer"
}

export type Message = {
	id: string
	senderId: string
	receiverId: string
	content: string
	timestamp: Date
	attachments?: {
		type: "image" | "video"
		url: string
	}[]
	replyTo?: string
	reactions?: {
		[userId: string]: string
	}
}

export type Conversation = {
	id: string
	participants: string[]
	lastMessage: Message
	unreadCount: number
}

export default function MessageList({
	messages,
	currentUser
}: {
	messages: Message[]
	currentUser: User
}) {
	const [replyingTo, setReplyingTo] = useState<string | null>(null)

	const handleReaction = (messageId: string, reaction: string) => {
		// Here you would update the message with the new reaction
		console.log(`Reacting to message ${messageId} with ${reaction}`)
	}

	return (
		<div className="space-y-4">
			{messages.map((message) => (
				<Card
					key={message.id}
					className={`max-w-[80%] ${message.senderId === currentUser.id ? "ml-auto" : ""}`}
				>
					<CardContent className="p-4">
						<div className="flex items-start space-x-2">
							<Avatar>
								<AvatarImage
									src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.senderId}`}
								/>
								<AvatarFallback>
									{message.senderId.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-semibold">
									{message.senderId === currentUser.id ? "You" : "Other User"}
								</p>
								<p>{message.content}</p>
								{message.attachments &&
									message.attachments.map((attachment, index) => (
										<div key={index} className="mt-2">
											{attachment.type === "image" ? (
												<img
													src={attachment.url}
													alt="Attachment"
													className="h-auto max-w-full rounded"
												/>
											) : (
												<video
													src={attachment.url}
													controls
													className="h-auto max-w-full rounded"
												/>
											)}
										</div>
									))}
								<div className="mt-2 flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setReplyingTo(message.id)}
									>
										Reply
									</Button>
									<Popover>
										<PopoverTrigger asChild>
											<Button variant="outline" size="sm">
												React
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-2">
											<div className="flex space-x-2">
												{["👍", "❤️", "😂", "😮", "😢", "😡"].map(
													(reaction) => (
														<button
															key={reaction}
															className="text-2xl transition-transform hover:scale-125"
															onClick={() =>
																handleReaction(message.id, reaction)
															}
														>
															{reaction}
														</button>
													)
												)}
											</div>
										</PopoverContent>
									</Popover>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
