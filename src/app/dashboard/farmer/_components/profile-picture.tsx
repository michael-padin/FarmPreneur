import { auth } from "@/auth"
import Image from "next/image"
import Link from "next/link"

export async function ProfilePicture() {
	const user = (await auth())?.user

	return (
		<div className="relative h-16 w-16 overflow-hidden rounded-full">
			<Link href={`/dashboard/farmer/profile`} prefetch>
				<Image
					src={user?.profilePicture || "/placeholder.svg"}
					alt={`Farmer's profile picture`}
					fill
					priority
					sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
					className="rounded-full object-cover"
				/>
			</Link>
		</div>
	)
}
