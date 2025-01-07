import { auth } from "@/auth"
import { FPBackButton } from "@/components/fp/fp-back-button"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Chat } from "../_components/chat"

type Params = Promise<{ userId: string }>

export default async function ChatPage({ params }: { params: Params }) {
	const otherUserId = (await params).userId
	const session = await auth()

	if (!session) {
		redirect("/login")
	}

	const currentUserId = session.user.id
	const role = session.user.role

	const messages = await db.message.findMany({
		where: {
			OR: [
				{ senderId: currentUserId, receiverId: otherUserId },
				{ senderId: otherUserId, receiverId: currentUserId }
			]
		},
		orderBy: { createdAt: "asc" },
		include: {
			sender: {
				include: {
					customer: true,
					farmer: true
				}
			}
		}
	})

	const otherUser = await db.user.findUnique({
		where: { id: otherUserId },
		include: {
			farmer: true,
			customer: true
		}
	})

	if (!otherUser) {
		return <div className="p-4 text-center">User not found</div>
	}

	return (
		<>
			<header className="">
				<div className="flex items-center gap-3 bg-white p-4 px-3 shadow-sm">
					<FPBackButton />
					<div className="flex items-center">
						<h1 className="text-xl font-semibold">
							{otherUser?.customer?.name || "Unknown"}
						</h1>
					</div>
				</div>
			</header>
			<main className="overflow-hidden bg-secondary">
				<Chat
					currentUserId={currentUserId}
					currentRole={role}
					otherUser={otherUser}
					initialMessages={messages}
				/>
			</main>
		</>
	)
}
