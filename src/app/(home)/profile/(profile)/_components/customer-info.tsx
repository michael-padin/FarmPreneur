import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCustomerProfileUseCase } from "@/use-cases/customers"
import { formatDate } from "date-fns"

export async function CustomerInfo() {
	const customerInfo = await getCustomerProfileUseCase()
	return (
		<div className="rounded-lg bg-background p-4">
			<div className="flex gap-4">
				<Avatar className="h-14 w-14 border-2 border-primary">
					<AvatarImage
						src={`${customerInfo.profilePicture} `}
						alt="Profile picture"
					/>
					<AvatarFallback>{customerInfo.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-px truncate">
					<h1 className="text-lg font-semibold capitalize text-primary">
						{customerInfo.name}
					</h1>
					<p className="inline-flex items-center truncate text-sm text-muted-foreground">
						Joined: {formatDate(customerInfo!.createdAt!, "PPP")}
					</p>
				</div>
			</div>
		</div>
	)
}
