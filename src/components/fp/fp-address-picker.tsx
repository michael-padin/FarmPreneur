"use client"

import { Address } from "@/app/dashboard/(admin)/users/(lists)/types"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { useClickOutside } from "@/hooks/use-click-outside-ref"
import { useMapbox } from "@/hooks/use-mapbox"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getErrorMessage } from "@/lib/handle-error"
import { Feature, FeatureCollection } from "@/types"
import { DialogClose } from "@radix-ui/react-dialog"
import { ClassValue } from "clsx"
import { Crosshair, Loader2, MapPin } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "../ui/dialog"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "../ui/drawer"

interface LatLng {
	lat: number
	lng: number
}

const DEFAULT_CENTER: LatLng = {
	lng: -74.006,
	lat: 40.7128 // New York City coordinates
}

interface FPAddressPickerProps {
	onAddressSelect?: (address: Address) => void
	defaultValue?: string
	defaultCenter?: LatLng
	defaultZoom?: number
	readonly?: boolean
	mapClassName?: ClassValue
	showMap?: boolean
	dialogTriggerText?: string
}

const defaultAddress: Address = {
	fullAddress: "",
	street: "",
	region: "",
	country: "",
	postalCode: "",
	latitude: 0,
	longitude: 0
}

export function FPAddressPicker({
	onAddressSelect,
	defaultValue = "",
	defaultCenter = DEFAULT_CENTER,
	defaultZoom,
	showMap = false,
	dialogTriggerText = "Choose on map"
}: FPAddressPickerProps) {
	const [openDialog, setOpenDialog] = useState(false)

	const [inputValue, setInputValue] = useState(defaultValue)
	const mapboxApiKey = process.env.NEXT_PUBLIC_MAP_BOX_PUBLIC_KEY!

	const { initializeMap, updateMarkerPosition } = useMapbox({
		draggable: true,
		mapboxApiKey,
		defaultCenter,
		defaultZoom,
		onMarkerDragEnd: handleMarkerDragEnd
	})

	useEffect(() => {
		setInputValue(defaultValue)
	}, [defaultValue])

	async function handleMarkerDragEnd(lngLat: mapboxgl.LngLat) {
		try {
			const response = await fetch(
				`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lngLat.lng}&latitude=${lngLat.lat}&access_token=${mapboxApiKey}`
			)

			const featureData: FeatureCollection = await response.json()

			if (featureData.features && featureData.features.length > 0) {
				const feature = featureData.features[0]
				const newAddress = createAddressFromFeature(
					feature,
					lngLat.lat,
					lngLat.lng
				)
				onAddressSelect?.(newAddress)
				setInputValue?.(featureData.features[0].properties.full_address)
			}
		} catch (error) {
			console.error("Error reverse geocoding:", error)
			toast("Error", {
				description: "Failed to get address from location. Please try again."
			})
		}
	}

	const createAddressFromFeature = useMemo(
		() =>
			(feature: Feature, lat: number, lng: number): Address => {
				return {
					fullAddress: feature.properties.full_address || "",
					street: feature.properties.context.street?.name || "",
					region: feature.properties.context.region?.name || "",
					country: feature.properties.context.country?.name || "",
					postalCode: feature.properties.context.postcode?.name || "",
					latitude: lat || 0,
					longitude: lng || 0
				}
			},
		[]
	)

	return (
		<div>
			<div className="w-full space-y-1">
				<AddressInput
					inputValue={inputValue}
					mapboxApiKey={mapboxApiKey}
					createAddressFromFeature={createAddressFromFeature}
					updateMarkerPosition={updateMarkerPosition}
					onAddressSelect={onAddressSelect}
					setInputValue={setInputValue}
				/>
				{showMap && (
					<MapDrawerDialog
						open={openDialog}
						onOpenChangeAction={setOpenDialog}
						dialogTriggerText={dialogTriggerText}
					>
						<div className="space-y-2">
							<div className="w-full lg:w-1/2">
								<AddressInput
									inputValue={inputValue}
									mapboxApiKey={mapboxApiKey}
									createAddressFromFeature={createAddressFromFeature}
									updateMarkerPosition={updateMarkerPosition}
									onAddressSelect={onAddressSelect}
									setInputValue={setInputValue}
								/>
							</div>
							<MapBox initializeMap={initializeMap} />
						</div>
					</MapDrawerDialog>
				)}
			</div>
		</div>
	)
}

interface AddressInputProps {
	inputValue: string
	setInputValue?: React.Dispatch<React.SetStateAction<string>>
	onAddressSelect?: (address: Address) => void
	mapboxApiKey: string
	updateMarkerPosition?: (lng: number, lat: number) => void
	createAddressFromFeature?: (
		feature: Feature,
		lat: number,
		lng: number
	) => Address
	dialogTriggerText?: string
}
export const AddressInput = ({
	inputValue,
	setInputValue,
	createAddressFromFeature,
	updateMarkerPosition,
	mapboxApiKey,
	onAddressSelect,
	dialogTriggerText
}: AddressInputProps) => {
	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const commandListRef = useRef<HTMLDivElement>(null)
	const [loading, setLoading] = useState(false)
	const debounceTimeout = useRef<NodeJS.Timeout>(undefined)
	const [suggestions, setSuggestions] = useState<FeatureCollection["features"]>(
		[]
	)
	useEffect(() => {
		if (suggestions.length > 0) {
			setOpen(true)
		}
	}, [suggestions])
	useClickOutside(commandListRef, () => setOpen(false))

	const searchAddress = useCallback(
		async (query: string) => {
			if (!query) {
				setSuggestions([])
				return
			}

			setLoading(true)
			try {
				const response = await fetch(
					`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&proximity=ip&access_token=${mapboxApiKey}`
				)
				const data: FeatureCollection = await response.json()
				setSuggestions(data.features || [])
			} catch (error) {
				console.error("Error fetching suggestions:", error)
				toast("Failed to fetch address suggestions. Please try again.")
				setSuggestions([])
			} finally {
				setLoading(false)
			}
		},
		[mapboxApiKey]
	)

	const handleInputChange = useCallback(
		(value: string) => {
			setInputValue?.(value)

			if (value.trim() === "") {
				// Set the address to undefined if the input is empty (e.g., after a backspace clears it)
				onAddressSelect?.(defaultAddress)
				return
			}

			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current)
			}

			debounceTimeout.current = setTimeout(() => {
				searchAddress(value)
			}, 300)
		},
		[onAddressSelect, searchAddress, setInputValue]
	)

	const handleSelect = useCallback(
		(suggestion: Feature) => {
			setInputValue?.(suggestion.properties.full_address)
			setOpen(false)

			const [lng, lat] = suggestion.geometry.coordinates
			updateMarkerPosition?.(lng, lat)

			const newAddress = createAddressFromFeature?.(suggestion, lat, lng)
			onAddressSelect?.(newAddress || defaultAddress)
		},
		[
			createAddressFromFeature,
			onAddressSelect,
			setInputValue,
			updateMarkerPosition
		]
	)

	const getCurrentLocation = useCallback(() => {
		if (!navigator.geolocation) {
			getErrorMessage("Geolocation is not supported by your browser")
			return
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords

				updateMarkerPosition?.(longitude, latitude)

				try {
					const response = await fetch(
						`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${mapboxApiKey}`
					)
					const data: FeatureCollection = await response.json()

					if (data.features && data.features.length > 0) {
						const feature = data.features[0]
						const newAddress = createAddressFromFeature?.(
							feature,
							latitude,
							longitude
						)
						setInputValue?.(data.features[0].properties.full_address)
						onAddressSelect?.(newAddress || defaultAddress)
					}
				} catch (error) {
					console.error("Error reverse geocoding:", error)
					getErrorMessage(
						"Failed to get address from your location. Please try again."
					)
				}
			},
			(error) => {
				getErrorMessage("Error getting location")
			}
		)
	}, [
		createAddressFromFeature,
		mapboxApiKey,
		onAddressSelect,
		setInputValue,
		updateMarkerPosition
	])

	return (
		<Command className="relative overflow-visible">
			<div className="flex space-x-2">
				<>
					<Input
						ref={inputRef}
						value={inputValue}
						onChange={(e) => handleInputChange(e.target.value)}
						placeholder="Search address..."
						className="w-full"
						aria-label="Search address"
					/>
					<Button
						variant="outline"
						size="icon"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							getCurrentLocation?.()
						}}
						title="Use current location"
						type="button"
						aria-label="Use current location"
					>
						<Crosshair className="h-4 w-4" />
					</Button>
				</>
			</div>
			{open && (
				<CommandList
					className="absolute left-0 right-0 top-[46px] z-20 rounded-lg border bg-background shadow-md"
					ref={commandListRef}
				>
					{!loading && suggestions.length === 0 && inputValue && (
						<CommandEmpty>No results found.</CommandEmpty>
					)}
					<CommandGroup heading={loading ? "Searching..." : "Suggestions"}>
						{loading ? (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="h-6 w-6 animate-spin text-primary" />
							</div>
						) : (
							suggestions.map((suggestion) => (
								<CommandItem
									key={suggestion.id}
									onSelect={() => handleSelect(suggestion)}
									className="cursor-pointer"
								>
									<div>
										<MapPin className="mr-2 h-4 w-4" />
									</div>
									{suggestion.properties.full_address}
								</CommandItem>
							))
						)}
					</CommandGroup>
				</CommandList>
			)}
		</Command>
	)
}

interface MapDrawerDialogProps {
	open: boolean
	onOpenChangeAction: React.Dispatch<React.SetStateAction<boolean>>
	children: React.ReactNode
	dialogTriggerText?: string
}
export const MapDrawerDialog = ({
	open,
	onOpenChangeAction,
	children,
	dialogTriggerText = "Choose on map"
}: MapDrawerDialogProps) => {
	const isDesktop = useMediaQuery("(min-width: 768px)")

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChangeAction}>
				<div>
					<DialogTrigger asChild>
						<span className="ml-2 cursor-pointer text-xs text-primary">
							{dialogTriggerText}
						</span>
					</DialogTrigger>
				</div>
				<DialogContent className="max-w-screen-md">
					<DialogHeader>
						<DialogTitle>
							Choose on <span className="text-primary">Map</span>
						</DialogTitle>
						<DialogDescription>
							Search or drag the marker to the location
						</DialogDescription>
					</DialogHeader>
					<div className="">{children}</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={() => onOpenChangeAction(false)}>Confirm</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChangeAction} dismissible={false}>
			<DrawerTrigger asChild>
				<span className="ml-2 cursor-pointer text-xs text-primary">
					{dialogTriggerText}
				</span>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>
						Choose on <span className="text-primary">Map</span>
					</DrawerTitle>
					<DrawerDescription>
						Search or drag the marker to the location
					</DrawerDescription>
				</DrawerHeader>
				<div className="w-full px-4">{children}</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button onClick={() => onOpenChangeAction(false)}>Close</Button>
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
