import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { getFarmerAddressListUseCase } from "@/use-cases/address"
import { MapPin, PenSquare } from "lucide-react"
import Link from "next/link"
import { formatPhoneNumber } from "react-phone-number-input"

export function FarmerAddressItem({
	address
}: {
	address: Awaited<ReturnType<typeof getFarmerAddressListUseCase>>[0]
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
						{address.label}
						{address.isDefault && (
							<span className="ml-2 text-xs text-primary">(Default)</span>
						)}
					</Label>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							{address.fullAddress}
						</p>
						<p className="text-sm">{address?.contactName}</p>
						<p className="text-sm text-muted-foreground">
							{formatPhoneNumber(address.contactNumber)}
						</p>
						<p className="text-sm">
							Note:{" "}
							<span className="text-muted-foreground">{address.note}</span>
						</p>
					</div>
				</div>
				<Button variant="ghost" size="icon" className="shrink-0" asChild>
					<Link href={`/dashboard/farmer/profile/address/${address.id}/edit`}>
						<PenSquare className="h-4 w-4" />
						<span className="sr-only">Edit address</span>
					</Link>
				</Button>
			</CardContent>
		</Card>
	)
}
