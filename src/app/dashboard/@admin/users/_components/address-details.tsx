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
import { useMapbox } from "@/hooks/use-mapbox"

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
				<DialogContent
					className="max-w-screen-lg"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle>
							<span className="text-primary">{user.name}&apos;s</span> Address
						</DialogTitle>
						<DialogDescription>{user.Address?.fullAddress}</DialogDescription>
					</DialogHeader>
					<div className="w-full">
						<MapBox
							lng={user.Address?.longitude}
							lat={user.Address?.latitude}
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
					<span className="cursor-pointer text-xs text-primary">
						View in map
					</span>
				</DrawerTrigger>
			</div>
			<DrawerContent onOpenAutoFocus={(e) => e.preventDefault()}>
				<DrawerHeader className="text-left">
					<DrawerTitle>
						<span className="text-primary">{user.name}&apos;s</span> Address
					</DrawerTitle>
					<DrawerDescription>{user.Address?.fullAddress}</DrawerDescription>
				</DrawerHeader>
				<div className="w-full px-4">
					<MapBox lng={user.Address?.longitude} lat={user.Address?.latitude} />
				</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button>Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export const MapBox = ({
	lng = 0,
	lat = 0
}: {
	lng?: number
	lat?: number
}) => {
	const mapContainer = React.useRef<HTMLDivElement>(null)
	const { initializeMap } = useMapbox({
		mapboxApiKey: process.env.NEXT_PUBLIC_MAP_BOX_PUBLIC_KEY!,
		defaultCenter: { lng, lat }
	})

	React.useEffect(() => {
		if (mapContainer.current) {
			initializeMap(mapContainer.current)
		}
	}, [initializeMap])

	return (
		<div
			ref={mapContainer}
			className={`aspect-square w-full rounded-md lg:aspect-video`}
			aria-label="Map"
		/>
	)
}
