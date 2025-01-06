import { auth } from "@/auth"
import { FPBackButton } from "@/components/fp/fp-back-button"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Chat } from "../_components/chat"

type Params = Promise<{ userId: string }>

export default async function ChatPage({ params }: { params: Params }) {
	const session = await auth()

	if (!session) {
		redirect("/login")
	}

	const currentUserId = session.user.id
	const otherUserId = (await params).userId
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
			farmer: true
		}
	})

	if (!otherUser) {
		return <div className="p-4 text-center">User not found</div>
	}

	return (
		<>
			<header className="fixed left-0 right-0 top-0 z-50">
				<div className="flex items-center gap-3 bg-white p-4 px-3 shadow-sm">
					<FPBackButton />
					<div className="flex items-center">
						<h1 className="text-xl font-semibold">
							{otherUser?.farmer?.farmName || "Unknown"}
						</h1>
					</div>
				</div>
			</header>
			<main className="h-screen overflow-auto bg-secondary py-20">
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
