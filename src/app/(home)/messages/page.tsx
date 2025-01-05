import { auth } from "@/auth"
import { FPLinkBackButton } from "@/components/fp/fp-back-button"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { MessageList } from "./_components/message-list"

export default async function MessagesPage() {
	const session = await auth()

	if (!session) redirect("/login")

	const currentUserId = session.user.id || ""
	const role = session.user.role

	const conversations = await db.user.findMany({
		where: {
			OR: [
				{ sentMessages: { some: { receiverId: currentUserId } } },
				{ receivedMessages: { some: { senderId: currentUserId } } }
			]
		},
		include: {
			customer: true,
			farmer: true,
			sentMessages: {
				where: { receiverId: currentUserId },
				orderBy: { createdAt: "desc" },
				take: 1,
				include: {
					sender: {
						include: {
							customer: true,
							farmer: true
						}
					}
				}
			},
			receivedMessages: {
				where: { senderId: currentUserId },
				orderBy: { createdAt: "desc" },
				take: 1,
				include: {
					sender: {
						include: {
							customer: true,
							farmer: true
						}
					}
				}
			}
		},
		take: 20
	})

	const conversationsWithLastMessage = conversations.map((conversation) => {
		const lastMessage =
			conversation.sentMessages[0]?.createdAt >
			conversation.receivedMessages[0]?.createdAt
				? conversation.sentMessages[0]
				: conversation.receivedMessages[0]

		return {
			...conversation,
			lastMessage: {
				...lastMessage,
				sender: lastMessage.sender
			}
		}
	})

	async function fetchMoreConversations(lastId: string, currentUserId: string) {
		"use server"
		const moreConversations = await db.user.findMany({
			where: {
				OR: [
					{ sentMessages: { some: { receiverId: currentUserId } } },
					{ receivedMessages: { some: { senderId: currentUserId } } }
				],
				id: { lt: lastId }
			},
			include: {
				customer: true,
				farmer: true,
				sentMessages: {
					where: { receiverId: currentUserId },
					orderBy: { createdAt: "desc" },
					take: 1,
					include: {
						sender: {
							include: {
								customer: true,
								farmer: true
							}
						}
					}
				},
				receivedMessages: {
					where: { senderId: currentUserId },
					orderBy: { createdAt: "desc" },
					take: 1,
					include: {
						sender: {
							include: {
								customer: true,
								farmer: true
							}
						}
					}
				}
			},
			take: 20
		})

		return moreConversations.map((conversation) => {
			const lastMessage =
				conversation.sentMessages[0]?.createdAt >
				conversation.receivedMessages[0]?.createdAt
					? conversation.sentMessages[0]
					: conversation.receivedMessages[0]

			return {
				...conversation,
				lastMessage: {
					...lastMessage,
					sender: lastMessage.sender
				}
			}
		})
	}

	return (
		<>
			<header className="fixed left-0 right-0 top-0 z-50 border-b bg-background px-3 py-4">
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<FPLinkBackButton href="/" />
						<div className="">
							<h2 className={`text-xs font-bold ${"text-primary"}`}>
								FarmPreneur
							</h2>
							<h1 className="text-2xl font-semibold">Messages</h1>
						</div>
					</div>
				</div>
			</header>
			<div className="pt-20">
				<MessageList
					currentUserId={currentUserId}
					role={role}
					initialConversations={conversationsWithLastMessage}
					fetchMoreConversations={fetchMoreConversations}
				/>
			</div>
		</>
	)
}
