import { AddressDetailsDrawerDialog } from "@/app/dashboard/(admin)/users/(lists)/_components/address-details"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { Edit, MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const getFarmerBasicInfo = async (farmerId?: string) => {
	const farmer = await db.farmer.findUnique({
		where: { id: farmerId },
		include: {
			user: {
				select: {
					email: true
				}
			},
			address: {
				select: {
					fullAddress: true,
					latitude: true,
					longitude: true
				}
			},
			_count: {
				select: {
					orders: true,
					products: true
				}
			}
		}
	})

	const productReview = await db.productReview.aggregate({
		where: {
			product: {
				farmerId: farmerId
			}
		},
		_avg: {
			rating: true
		}
	})

	return {
		address: {
			fullAddress: farmer?.address?.[0]?.fullAddress || "",
			latitude: farmer?.address?.[0]?.latitude || 0,
			longitude: farmer?.address?.[0]?.longitude || 0
		},
		createdAt: farmer?.createdAt || "",
		farmName: farmer?.farmName || "",
		email: farmer?.user.email || "",
		profilePicture: farmer?.profilePicture || "",
		contactNumber: farmer?.contactNumber || "",
		coverPhoto: farmer?.coverPhoto || "",
		totalOrders: farmer?._count.orders || 0,
		totalProducts: farmer?._count.products || 0,
		description: farmer?.farmDescription || "",
		rating: productReview._avg.rating || 0
	}
}
type Params = Promise<{ id: string }>

export async function FarmerProfile({ params }: { params: Params }) {
	const farmerId = (await params).id
	const farmerInfo = await getFarmerBasicInfo(farmerId)
	return (
		<>
			<div className="relative aspect-video w-full">
				<Image
					src={farmerInfo.coverPhoto || "/placeholder.svg"}
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
								src={farmerInfo.profilePicture || "/placeholder.svg"}
								alt={`${farmerInfo.farmName}'s profile picture`}
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
								<Link href="/dashboard/farmer/profile/edit">
									<Edit className="!h-3 !w-3" />
								</Link>
							</Button>
						</div>
						<div>
							<h1 className="text-2xl font-bold">{farmerInfo.farmName}</h1>
							<div className="flex gap-1">
								<MapPin className="mt-1 h-5 w-5" />
								<div className="">
									<span className="truncate">
										{farmerInfo.address.fullAddress}
									</span>
									<AddressDetailsDrawerDialog
										address={farmerInfo.address}
										title={`${farmerInfo.farmName}'s Location`}
									/>
								</div>
							</div>
						</div>
					</div>
					<p className="text-sm">{farmerInfo.description}</p>
					<div className="flex justify-between text-sm">
						<span>{farmerInfo.totalProducts} Products</span>
						<span>{farmerInfo.totalOrders} Orders</span>
						<span className="flex items-center gap-1">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							{farmerInfo.rating}
						</span>
					</div>
				</div>
			</div>
		</>
	)
}
