import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { abbreviateNumber } from "@/lib/utils"
import { getFarmerOwnProfileUseCase } from "@/use-cases/farmers"
import { MapPin, PhoneCall } from "lucide-react"

export async function FarmerInfo() {
	const farmerInfo = await getFarmerOwnProfileUseCase()
	return (
		<div className="py-8">
			<div className="flex gap-4">
				<Avatar className="h-24 w-24 border-2 border-primary">
					<AvatarImage
						src={`${farmerInfo.farmImages[0].url || farmerInfo.user.profilePicture?.url || "/placeholder.svg"} `}
						alt="Profile picture"
					/>
					<AvatarFallback>
						{farmerInfo.farmName?.charAt(0) || farmerInfo.user.name?.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-2 truncate">
					<h1 className="text-xl font-semibold capitalize text-primary">
						{farmerInfo.user.name || farmerInfo.farmName}
					</h1>
					<p className="inline-flex items-center gap-1 truncate text-sm">
						<MapPin className="h-4 w-4" />
						{farmerInfo.address[0].fullAddress}
					</p>
					<p className="inline-flex items-center gap-1 truncate text-sm">
						<PhoneCall className="h-4 w-4" />
						{farmerInfo.contactNumber}
					</p>
					<div className="mt-4 flex gap-8">
						<div className="text-center">
							<div className="font-semibold">{farmerInfo.averageRating}</div>
							<div className="text-xs text-muted-foreground lg:text-sm">
								Rating
							</div>
						</div>
						<div className="text-center">
							<div className="font-semibold">
								{abbreviateNumber(farmerInfo.products.length)}
							</div>
							<div className="text-xs text-muted-foreground lg:text-sm">
								Products
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
