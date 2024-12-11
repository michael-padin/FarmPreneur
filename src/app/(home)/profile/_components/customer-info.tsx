import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCustomerProfileUseCase } from "@/use-cases/customers"
import { MapPin, PhoneCall } from "lucide-react"

export async function CustomerInfo() {
	const customerInfo = await getCustomerProfileUseCase()
	return (
		<div className="">
			<div className="flex gap-4">
				<Avatar className="h-24 w-24 border-2 border-primary">
					<AvatarImage
						src={`${customerInfo.profilePicture} `}
						alt="Profile picture"
					/>
					<AvatarFallback>{customerInfo.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-2 truncate">
					<h1 className="text-xl font-semibold capitalize text-primary">
						{customerInfo.name}
					</h1>
					<p className="inline-flex items-center gap-1 truncate text-sm">
						<MapPin className="h-4 w-4" />
						{customerInfo.address.fullAddress}
					</p>
					<p className="inline-flex items-center gap-1 truncate text-sm">
						<PhoneCall className="h-4 w-4" />
						{customerInfo.contactNumber}
					</p>
				</div>
			</div>
		</div>
	)
}
