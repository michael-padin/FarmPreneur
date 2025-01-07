import FPDynamicImage from "@/components/fp/fp-dyanmic-image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Farmer, Message as MessageType, User } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

interface MessageProps {
	message: MessageType & {
		sender: User & {
			farmer?: Farmer | null
		}
	}
	currentUserId: string
	onReply?: (messageId: string) => void
	onReact?: (messageId: string, emoji: string) => void
}

export function Message({
	message,
	currentUserId,
	onReply,
	onReact
}: MessageProps) {
	const [showReactions, setShowReactions] = useState(false)
	const isOwnMessage = message.senderId === currentUserId

	// const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡"]

	return (
		<div
			className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
		>
			<div className="flex gap-2">
				{!isOwnMessage && (
					<div className="flex h-full justify-end">
						<Avatar className="flex h-8 w-8 items-center justify-center bg-background object-cover">
							<AvatarImage
								src={
									message.sender.farmer?.profilePicture || "/placeholder.png"
								}
							/>
							<AvatarFallback className="text-primary">
								{message.sender.name?.charAt(0)}
							</AvatarFallback>
							<span className="sr-only">{message.sender.farmer?.farmName}</span>
						</Avatar>
					</div>
				)}
				<div
					className={`flex flex-col ${isOwnMessage ? "items-end justify-end" : "items-start justify-start"} mb-4`}
				>
					<div
						className={`max-w-[250px] ${message.fileUrl ? "min-w-[250px]" : ""} ${isOwnMessage ? "bg-primary text-white" : "bg-white"} rounded-lg px-3 py-2 shadow`}
					>
						{/* {!isOwnMessage && (
						<p className="mb-1 text-sm font-semibold">
							{message.sender.customer?.name}
						</p>
					)} */}
						{message.fileType === "image" && message.fileUrl && (
							<FPDynamicImage src={message.fileUrl} alt="message image" />
						)}
						{message.fileType === "video" && message.fileUrl && (
							<video
								src={message.fileUrl}
								controls
								autoPlay={false}
								className="max-w-full rounded-lg"
							></video>
						)}
						<div className="break-words">
							<p className={`${message.fileUrl ? "mt-1" : ""} `}>
								{message.content}
							</p>
						</div>
						{/* <div
						className={`mt-2 flex items-center justify-between text-right ${isOwnMessage ? "text-white" : "text-muted-foreground"}`}
					>
						<div className="flex space-x-2">
							<div className="flex space-x-2">
								<button
									onClick={() => onReply(message.id)}
									className="text-muted-foreground"
								>
									<Reply className="h-4 w-4" />
								</button>
								<button
									onClick={() => setShowReactions(!showReactions)}
									className="text-white hover:text-gray-700"
								>
									<Smile className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div> */}
						{/* {showReactions && (
						<div className="absolute mt-2 rounded-lg bg-white p-2 shadow-lg">
							{reactionEmojis.map((emoji) => (
								<button
									key={emoji}
									onClick={() => onReact(message.id, emoji)}
									className="rounded p-1 text-2xl hover:bg-gray-100"
								>
									{emoji}
								</button>
							))}
						</div>
					)} */}
						{/* {message.reactions.length > 0 && (
						<div className="mt-1 flex">
							{message.reactions.map((reaction) => (
								<span key={reaction.id} className="mr-1 text-sm">
									{reaction.emoji}
								</span>
							))}
						</div>
					)} */}
					</div>
					<div
						className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"} mt-2 text-muted-foreground`}
					>
						<span className="text-right text-xs">
							Sent{" "}
							{formatDistanceToNow(new Date(message.createdAt), {
								addSuffix: true
							})}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
