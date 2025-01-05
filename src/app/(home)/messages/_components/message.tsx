import { Message as MessageType, User } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

interface MessageProps {
	message: MessageType & {
		sender: User
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
			<div
				className={`max-w-[70%] ${isOwnMessage ? "bg-primary text-white" : "bg-white"} rounded-xl p-3 shadow`}
			>
				{!isOwnMessage && (
					<p className="mb-1 text-sm font-semibold">{message.sender.name}</p>
				)}

				{message.fileType === "image" && message.fileUrl && (
					<img
						src={message.fileUrl}
						alt="Shared image"
						className="mb-2 max-w-full cursor-pointer rounded-lg"
						// onClick={() =>
						// 	openLightbox(imageMessages.findIndex((m) => m.id === message.id))
						// }
					/>
				)}
				{message.fileType === "video" && message.fileUrl && (
					<video
						src={message.fileUrl}
						controls
						className="mb-2 max-w-full rounded-lg"
					></video>
				)}
				<p>{message.content}</p>
				<div className="mt-2 flex items-center justify-between text-right text-white">
					<span className="text-right text-xs">
						{formatDistanceToNow(new Date(message.createdAt), {
							addSuffix: true
						})}
					</span>
					<div className="flex space-x-2">
						<div className="flex space-x-2">
							{/* <button
								onClick={() => onReply(message.id)}
								className="text-muted-foreground"
							>
								<Reply className="h-4 w-4" />
							</button> */}
							{/* <button
								onClick={() => setShowReactions(!showReactions)}
								className="text-white hover:text-gray-700"
							>
								<Smile className="h-4 w-4" />
							</button> */}
						</div>
					</div>
				</div>
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
		</div>
	)
}
