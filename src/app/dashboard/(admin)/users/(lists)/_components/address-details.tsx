"use client"
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
import { useMapbox } from "@/hooks/use-mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { Address } from "@prisma/client"

interface AddressDetailsDrawerDialogProps {
	address: Address
	name?: string
}

export const AddressDetailsDrawerDialog = ({
	address,
	name
}: AddressDetailsDrawerDialogProps) => {
	const [open, setOpen] = React.useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const mapboxApiKey = process.env.NEXT_PUBLIC_MAP_BOX_PUBLIC_KEY!

	const { initializeMap } = useMapbox({
		draggable: false,
		mapboxApiKey,
		defaultCenter: {
			lng: address!.longitude,
			lat: address!.latitude
		}
	})
	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<div>
					<DialogTrigger asChild>
						<span className="cursor-pointer text-xs text-primary">
							View in map
						</span>
					</DialogTrigger>
				</div>
				<DialogContent className="max-w-screen-lg">
					<DialogHeader>
						<DialogTitle>
							<span className="text-primary">{name}&apos;s</span> address
						</DialogTitle>
						<DialogDescription>{address?.fullAddress}</DialogDescription>
					</DialogHeader>
					<div>
						<MapBox initializeMap={initializeMap} />
					</div>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen} dismissible={false}>
			<div>
				{/* <p className="w-[180px] truncate">{address?.fullAddress}</p> */}
				<DrawerTrigger asChild>
					<span className="cursor-pointer text-xs text-primary">
						View in map
					</span>
				</DrawerTrigger>
			</div>
			<DrawerContent onOpenAutoFocus={(e) => e.preventDefault()}>
				<DrawerHeader className="text-left">
					<DrawerTitle>
						<span className="text-primary">{name}&apos;s</span> address
					</DrawerTitle>
					<DrawerDescription>{address?.fullAddress}</DrawerDescription>
				</DrawerHeader>
				<div className="w-full px-4">
					<MapBox initializeMap={initializeMap} />
				</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

interface MapBoxDrawerDialogProps {
	initializeMap?: (container: HTMLDivElement) => void
}
export const MapBox = ({ initializeMap }: MapBoxDrawerDialogProps) => {
	const mapContainer = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		if (mapContainer.current) {
			initializeMap?.(mapContainer.current)
		}
	}, [initializeMap, mapContainer])

	return (
		<div
			ref={mapContainer}
			className={`relative aspect-square w-full rounded-md lg:aspect-video`}
			aria-label="Map"
		></div>
	)
}
