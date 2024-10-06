import { MobileNav } from "../_components"
import Image from "next/image"
import { auth } from "@/auth"
import { Icons } from "@/components/icons"
import Link from "next/link"
import Recommend from "../_components/recommend"
import { redirect } from "next/navigation"
import { SignOutButton } from "./_components/signout-button"

const getUser = async () => {
	// const res = await getUserByEmail()
	// const data = await res.json()
	// return data
}

export default async function BuyerProfilePage() {
	const session = await auth()
	if (!session) redirect("/login")
	const user = session.user

	if (!user) redirect("/login")

	return (
		<>
			<MobileNav />
			<div className="min-h-screen bg-gray-100 pb-16 pt-[72px]">
				<div className="mx-auto">
					<div className="space-y-4 bg-primary px-2 pb-4">
						<div className="flex items-center gap-6">
							<div className="">
								<div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-300">
									<Image
										placeholder="empty"
										src={user.image || "/placeholder.svg"}
										alt="user avatar"
										fill
										objectFit="covert"
										objectPosition="center"
									/>
								</div>
							</div>
							<div className="space-y-2 truncate">
								<h1 className="text-2xl font-bold text-primary-foreground">
									{user.name || user.email}
								</h1>
								<div className="flex items-center space-x-2 text-sm text-white">
									<p>
										Joined:{" "}
										<span className="">
											{new Date(user.createdAt ?? "").toLocaleDateString(
												"en-US",
												{
													year: "numeric",
													month: "long",
													day: "numeric"
												}
											)}
										</span>
									</p>
								</div>
							</div>
						</div>
						<div className="w-full">
							<div className="flex">
								<Link
									href="/register-farmer"
									className="flex items-center gap-2 rounded-lg bg-white p-2 text-primary"
								>
									<span className="text-sm font-semibold">
										Start Farming(Selling)
									</span>
									<Icons.arrowRight className="text-primary" />
								</Link>
							</div>
						</div>
					</div>
					{/* MARK: purchases */}
					<div className="bg-background p-2">
						{/* <div className="flex items-center justify-between py-2">
							<h2 className="font-semibold">My Profile</h2>
							<Link href={`/orders`}>
								<Icons.chevronRight className="text-foreground" />
							</Link>
						</div> */}
						<div className="flex items-center justify-between py-2">
							<h2 className="font-semibold">My Orders</h2>
							<Link href={`/orders`}>
								<Icons.chevronRight className="text-foreground" />
							</Link>
						</div>
						<div className="py-5">
							<div className="grid grid-cols-3 gap-4">
								<div className="flex flex-col items-center justify-center gap-2">
									<Icons.truck className="text-foreground" />
									<span className="text-xs">To Ship</span>
								</div>
								<div className="flex flex-col items-center justify-center gap-2">
									<Icons.box className="text-foreground" />
									<span className="text-xs">To Receive</span>
								</div>
								<div className="flex flex-col items-center justify-center gap-2">
									<Icons.star className="text-foreground" />
									<span className="text-xs">To Rate</span>
								</div>
							</div>
						</div>
						<div className="flex justify-end">
							<SignOutButton />
						</div>
					</div>
				</div>
				<div className="">
					<div className="mt-2 flex justify-between p-2">
						<h3>You May Also Like</h3>
						<p>See all</p>
					</div>
					<div className="bg-background p-2">
						<Recommend />
					</div>
				</div>
			</div>
		</>
	)
}
