import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { LocationType, locationTypeItems } from "@/constants/addres"
import { getCustomerAddressListUseCase } from "@/use-cases/address"
import { MapPin, PenSquare } from "lucide-react"
import Link from "next/link"

export function CustomerAddressItem({
	address
}: {
	address: Awaited<ReturnType<typeof getCustomerAddressListUseCase>>[0]
}) {
	return (
		<Card key={address.id} className="border-none outline-none">
			<CardContent className="flex items-start p-4">
				<RadioGroupItem
					value={address.id}
					id={`address-${address.id}`}
					className="mt-1"
				/>
				<div className="ml-4 flex-grow">
					<Label
						htmlFor={`address-${address.id}`}
						className="flex items-center text-base font-semibold"
					>
						<MapPin className="mr-2 h-4 w-4 text-primary" />
						{locationTypeItems[address.locationType as LocationType]}
						{address.isDefault && (
							<span className="ml-2 text-xs text-primary">(Default)</span>
						)}
					</Label>
					<p className="mt-1 text-sm text-muted-foreground">
						{address.fullAddress}
					</p>
					<p className="mt-1 text-sm">{address?.contactName}</p>
					<p className="text-sm text-muted-foreground">
						{address.contactNumber}
					</p>
				</div>
				<Button variant="ghost" size="icon" className="shrink-0" asChild>
					<Link href={`/profile/address/${address.id}/edit`}>
						<PenSquare className="h-4 w-4" />
						<span className="sr-only">Edit address</span>
					</Link>
				</Button>
			</CardContent>
		</Card>
	)
}
