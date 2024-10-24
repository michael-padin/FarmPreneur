"use client"

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Crosshair, Loader2 } from "lucide-react"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/components/ui/command"
import { useToast } from "@/components/ui/use-toast"
import "mapbox-gl/dist/mapbox-gl.css"
import { FeatureCollection } from "@/types"
import { useClickOutside } from "@/hooks/use-click-outside-ref"
import { Address } from "@/app/dashboard/@admin/users/types"
import { useMapbox } from "@/hooks/use-mapbox"

interface LatLng {
	lat: number
	lng: number
}

const DEFAULT_CENTER: LatLng = {
	lng: -74.006,
	lat: 40.7128 // New York City coordinates
}

interface AddressInputProps {
	onAddressSelect?: (address: Address) => void
	defaultValue?: string
	defaultCenter?: LatLng
	defaultZoom?: number
	readonly?: boolean
}

export default function AddressInput({
	onAddressSelect,
	defaultValue = "",
	defaultCenter = DEFAULT_CENTER,
	defaultZoom = 16,
	readonly = false
}: AddressInputProps) {
	const { toast } = useToast()
	const commandListRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const [inputValue, setInputValue] = useState(defaultValue)
	const [suggestions, setSuggestions] = useState<FeatureCollection[]>([])
	const [loading, setLoading] = useState(false)
	const mapboxApiKey = process.env.NEXT_PUBLIC_MAP_BOX_PUBLIC_KEY!

	const mapContainer = useRef<HTMLDivElement>(null)

	const inputRef = useRef<HTMLInputElement>(null)
	const debounceTimeout = useRef<NodeJS.Timeout>()

	const { initializeMap, updateMarkerPosition } = useMapbox({
		mapboxApiKey,
		defaultCenter,
		defaultZoom,
		onMarkerDragEnd: handleMarkerDragEnd
	})

	useEffect(() => {
		if (mapContainer.current) {
			initializeMap(mapContainer.current)
		}
	}, [initializeMap])

	useClickOutside(commandListRef, () => setOpen(false))

	async function handleMarkerDragEnd(lngLat: mapboxgl.LngLat) {
		try {
			const response = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxApiKey}`
			)
			const data = await response.json()
			if (data.features && data.features.length > 0) {
				const feature: FeatureCollection = data.features[0]
				const newAddress = createAddressFromFeature(
					feature,
					lngLat.lat,
					lngLat.lng
				)
				setInputValue(data.features[0].place_name)
				onAddressSelect?.(newAddress)
			}
		} catch (error) {
			console.error("Error reverse geocoding:", error)
			toast({
				title: "Error",
				description: "Failed to get address from location. Please try again.",
				variant: "destructive"
			})
		}
	}

	const searchAddress = useCallback(
		async (query: string) => {
			if (!query) {
				setSuggestions([])
				return
			}

			setLoading(true)
			try {
				const response = await fetch(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxApiKey}`
				)
				const data = await response.json()
				setSuggestions(data.features || [])
			} catch (error) {
				console.error("Error fetching suggestions:", error)
				toast({
					title: "Error",
					description: "Failed to fetch address suggestions. Please try again.",
					variant: "destructive"
				})
				setSuggestions([])
			} finally {
				setLoading(false)
			}
		},
		[mapboxApiKey, toast]
	)

	const handleInputChange = useCallback(
		(value: string) => {
			setInputValue(value)

			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current)
			}

			debounceTimeout.current = setTimeout(() => {
				searchAddress(value)
			}, 300)
		},
		[searchAddress]
	)

	const handleSelect = useCallback(
		(suggestion: FeatureCollection) => {
			setInputValue(suggestion.place_name)
			setOpen(false)

			const [lng, lat] = suggestion.center
			updateMarkerPosition(lng, lat)

			const newAddress = createAddressFromFeature(suggestion, lat, lng)
			onAddressSelect?.(newAddress)
		},
		[onAddressSelect, updateMarkerPosition]
	)

	const getCurrentLocation = useCallback(() => {
		if (!navigator.geolocation) {
			toast({
				title: "Error",
				description: "Geolocation is not supported by your browser",
				variant: "destructive"
			})
			return
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords

				updateMarkerPosition(longitude, latitude)

				try {
					const response = await fetch(
						`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxApiKey}`
					)
					const data = await response.json()

					if (data.features && data.features.length > 0) {
						const feature: FeatureCollection = data.features[0]
						const newAddress = createAddressFromFeature(
							feature,
							latitude,
							longitude
						)
						setInputValue(data.features[0].place_name)
						onAddressSelect?.(newAddress)
					}
				} catch (error) {
					console.error("Error reverse geocoding:", error)
					toast({
						title: "Error",
						description:
							"Failed to get address from your location. Please try again.",
						variant: "destructive"
					})
				}
			},
			(error) => {
				toast({
					title: "Error",
					description: `Error getting location: ${error.message}`,
					variant: "destructive"
				})
			}
		)
	}, [mapboxApiKey, onAddressSelect, toast, updateMarkerPosition])

	const createAddressFromFeature = useMemo(
		() =>
			(feature: FeatureCollection, lat: number, lng: number): Address => {
				return {
					fullAddress: feature.place_name,
					street: feature.text,
					city:
						feature.context?.find((c) => c.id.startsWith("place"))?.text || "",
					state:
						feature.context?.find((c) => c.id.startsWith("region"))?.text || "",
					country:
						feature.context?.find((c) => c.id.startsWith("country"))?.text ||
						"",
					postalCode:
						feature.context?.find((c) => c.id.startsWith("postcode"))?.text ||
						"",
					latitude: lat,
					longitude: lng
				}
			},
		[]
	)

	return (
		<div>
			{!readonly ? (
				<div className="w-full space-y-4">
					<Command className="relative overflow-visible">
						<div className="flex space-x-2">
							<>
								<Input
									ref={inputRef}
									value={inputValue}
									onChange={(e) => handleInputChange(e.target.value)}
									onFocus={() => setOpen(true)}
									onClick={() => setOpen(true)}
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
										getCurrentLocation()
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
								<CommandEmpty>No results found.</CommandEmpty>
								<CommandGroup
									heading={loading ? "Searching..." : "Suggestions"}
									className="p-2"
								>
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
												<MapPin className="mr-2 h-4 w-4" />
												{suggestion.place_name}
											</CommandItem>
										))
									)}
								</CommandGroup>
							</CommandList>
						)}
					</Command>
					<div
						ref={mapContainer}
						className={`aspect-square w-full rounded-md lg:aspect-video`}
						aria-label="Map"
					/>
				</div>
			) : (
				<div
					ref={mapContainer}
					className={`aspect-square w-full rounded-md lg:aspect-video`}
					aria-label="Map"
				/>
			)}
		</div>
	)
}
