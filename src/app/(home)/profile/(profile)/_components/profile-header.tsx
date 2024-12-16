import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const getCustomerBasicInfo = async (farmerId?: string) => {
	const customer = await db.customer.findUnique({
		where: {
			id: farmerId
		},
		include: {
			_count: {
				select: {
					address: true,
					orders: true,
					reviews: true
				}
			},

			user: {
				select: {
					email: true,
					createdAt: true,
					profilePicture: {
						select: {
							url: true
						}
					}
				}
			}
		}
	})

	await db.productReview.findMany({
		where: {
			customerId: customer?.id
		}
	})

	return {
		createdAt: customer?.createdAt || "",
		name: customer?.name || "",
		email: customer?.user.email || "",
		profilePicture: customer?.profilePicture || "",
		contactNumber: customer?.contactNumber || "",
		coverPhoto: customer?.coverPhoto || "",
		totalOrders: customer?._count.orders || 0,
		bio: customer?.bio || "",
		totalReviews: customer?._count.reviews || 0
	}
}

export async function CustomerProfileHeader() {
	const customerId = (await auth())?.user.customerId
	const customerInfo = await getCustomerBasicInfo(customerId)
	return (
		<>
			<div className="relative aspect-video w-full">
				<Image
					src={customerInfo.coverPhoto || "/placeholder.svg"}
					alt="Cover photo"
					fill
					className="object-cover"
				/>
			</div>
			<div className="relative mx-2 -mt-14 rounded-lg bg-background">
				<div className="space-y-4 p-4">
					<div className="flex items-center space-x-4">
						<div className="relative aspect-square h-20 w-20">
							<Image
								src={customerInfo.profilePicture || "/placeholder.svg"}
								alt={`${customerInfo.name}'s profile picture`}
								fill
								priority
								sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
								className="rounded-full object-cover"
							/>
							<Button
								size="icon"
								className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
								asChild
							>
								<Link href="/profile/edit">
									<Edit className="!h-3 !w-3" />
								</Link>
							</Button>
						</div>
						<div>
							<h1 className="text-2xl font-bold">{customerInfo.name}</h1>
							<p className="text-sm text-muted-foreground">
								{customerInfo.email}
							</p>
						</div>
					</div>
					<p className="text-sm">{customerInfo.bio}</p>
					<div className="flex justify-between text-sm">
						<span>{customerInfo.totalOrders} Orders</span>
						<span>{customerInfo.totalReviews} Reviews</span>
						{/* <span className="flex items-center gap-1">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							{customerInfo.rating}
						</span> */}
					</div>
				</div>
			</div>
		</>
	)
}
