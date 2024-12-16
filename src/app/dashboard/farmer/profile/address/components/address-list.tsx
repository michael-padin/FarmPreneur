"use client"
import { RadioGroup } from "@/components/ui/radio-group"
import { changeCustomerDefaultAddress } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { getFarmerAddressListUseCase } from "@/use-cases/address"
import { MapPin } from "lucide-react"
import { useTransition } from "react"
import { FarmerAddressItem } from "./farmer-address-item"

export function AddressList({
	addressList
}: {
	addressList: Awaited<ReturnType<typeof getFarmerAddressListUseCase>>
}) {
	const [isPending, startTransition] = useTransition()
	const handleDefaultChange = (addressId: string) => {
		startTransition(async () => {
			const { error } = await changeCustomerDefaultAddress({ addressId })

			if (error) {
				showErrorToast(error)
				return
			}
		})
	}

	return (
		<>
			{addressList.length > 0 ? (
				<RadioGroup
					defaultValue={addressList.find((a) => a.isDefault)?.id}
					onValueChange={handleDefaultChange}
					disabled={isPending}
				>
					{addressList.map((address, index) => (
						<FarmerAddressItem address={address} key={index} />
					))}
				</RadioGroup>
			) : (
				<div className="pt-20">
					<div className="flex h-full flex-col items-center justify-center text-muted-foreground">
						<div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-background">
							<MapPin className="h-8 w-8 text-primary" />
						</div>
						<p className="text-sm">You have empty address</p>
					</div>
				</div>
			)}
		</>
	)
}
