import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer"
import { getUsersUseCase } from "@/use-cases/users"
import AddressInput from "@/components/fg/fg-map-box-location-picker"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface AddressDetailsDrawerDialogProps {
	user: Awaited<ReturnType<typeof getUsersUseCase>>[0]
}

export const AddressDetailsDrawerDialog = ({
	user
}: AddressDetailsDrawerDialogProps) => {
	const [open, setOpen] = React.useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<div>
					<p className="w-[180px] truncate">{user.Address?.fullAddress}</p>
					<DialogTrigger asChild>
						<span className="cursor-pointer text-xs text-primary">
							View in map
						</span>
					</DialogTrigger>
				</div>
				<DialogContent className="max-w-screen-lg">
					<DialogHeader>
						<DialogTitle>
							<span className="text-primary">{user.name}&apos;s</span> Address
						</DialogTitle>
						<DialogDescription>{user.Address?.fullAddress}</DialogDescription>
					</DialogHeader>
					<div className="w-full">
						<AddressInput
							readonly
							defaultCenter={{
								lat: user.Address?.latitude || 0,
								lng: user.Address?.longitude || 0
							}}
							defaultValue={user.Address?.fullAddress}
							defaultZoom={15}
						/>
					</div>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<div>
				<p className="w-[180px] truncate">{user.Address?.fullAddress}</p>
				<DrawerTrigger asChild>
					<span className="text-xs text-primary">View in map</span>
				</DrawerTrigger>
			</div>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>
						<span className="text-primary">{user.name}&apos;s</span> Address
					</DrawerTitle>
					<DrawerDescription>{user.Address?.fullAddress}</DrawerDescription>
				</DrawerHeader>
				<div className="w-full px-4">
					<AddressInput
						readonly
						defaultCenter={{
							lat: user.Address?.latitude || 0,
							lng: user.Address?.longitude || 0
						}}
						defaultValue={user.Address?.fullAddress}
						mapAspectRatio="square"
					/>
				</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>Close</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
