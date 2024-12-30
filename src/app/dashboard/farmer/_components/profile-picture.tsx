import { auth } from "@/auth"
import Image from "next/image"
import Link from "next/link"

export async function ProfilePicture() {
	const user = (await auth())?.user

	return (
		<Link
			href={`/dashboard/farmer/profile`}
			prefetch
			className="relative h-20 w-20 overflow-hidden rounded-full"
		>
			<Image
				src={user?.profilePicture || "/placeholder.svg"}
				alt={`Farmer's profile picture`}
				fill
				priority
				sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
				className="rounded-full object-cover"
			/>
		</Link>
	)
}
