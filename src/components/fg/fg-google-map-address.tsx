"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from "@/components/ui/card"
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Crosshair, Loader2, MapPin } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEYk!

const mapContainerStyle = {
	width: "100%",
	height: "300px"
}

const defaultCenter = {
	lat: 40.7128,
	lng: -74.006 // New York City coordinates
}

interface LatLng {
	lat: number
	lng: number
}

// Sample data for autocomplete suggestions
const samplePlaces = [
	{
		place_id: "1",
		description: "New York, NY, USA",
		geometry: { location: { lat: 40.7128, lng: -74.006 } }
	},
	{
		place_id: "2",
		description: "Los Angeles, CA, USA",
		geometry: { location: { lat: 34.0522, lng: -118.2437 } }
	},
	{
		place_id: "3",
		description: "Chicago, IL, USA",
		geometry: { location: { lat: 41.8781, lng: -87.6298 } }
	}
]

const formSchema = z.object({
	location: z.string().min(2, {
		message: "Location must be at least 2 characters."
	})
})

export default function PolishedLocationPicker() {
	const [markerPosition, setMarkerPosition] = useState<LatLng>(defaultCenter)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const mapRef = useRef<google.maps.Map | null>(null)
	const geocoderRef = useRef<google.maps.Geocoder | null>(null)
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
		libraries: ["places"]
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			location: ""
		}
	})

	const onMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map
		geocoderRef.current = new window.google.maps.Geocoder()
	}, [])

	useEffect(() => {
		if (isLoaded) {
			const input = document.getElementById(
				"location-input"
			) as HTMLInputElement
			autocompleteRef.current = new window.google.maps.places.Autocomplete(
				input,
				{ types: ["geocode"] }
			)

			autocompleteRef.current.addListener("place_changed", () => {
				const place = autocompleteRef.current!.getPlace()
				if (place.geometry) {
					const newPosition = {
						lat: place.geometry.location!.lat(),
						lng: place.geometry.location!.lng()
					}
					setMarkerPosition(newPosition)
					if (mapRef.current) {
						mapRef.current.panTo(newPosition)
					}
					form.setValue("location", place.formatted_address || "")
				}
			})
		}
	}, [isLoaded, form])

	const updateAddress = (lat: number, lng: number) => {
		if (geocoderRef.current) {
			geocoderRef.current.geocode(
				{ location: { lat, lng } },
				(results, status) => {
					if (status === "OK" && results && results[0]) {
						form.setValue(
							"location",
							results[0].formatted_address ||
								`${lat.toFixed(6)}, ${lng.toFixed(6)}`
						)
					} else {
						form.setValue("location", `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
					}
				}
			)
		}
	}

	const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
		if (e.latLng) {
			const lat = e.latLng.lat()
			const lng = e.latLng.lng()
			setMarkerPosition({ lat, lng })
			updateAddress(lat, lng)
		}
	}

	const useCurrentLocation = () => {
		setIsLoading(true)
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					}
					setMarkerPosition(pos)
					if (mapRef.current) {
						mapRef.current.panTo(pos)
					}
					updateAddress(pos.lat, pos.lng)
					setIsLoading(false)
				},
				() => {
					toast({
						title: "Error",
						description: "Unable to retrieve your location.",
						variant: "destructive"
					})
					setIsLoading(false)
				}
			)
		} else {
			toast({
				title: "Error",
				description: "Geolocation is not supported by your browser.",
				variant: "destructive"
			})
			setIsLoading(false)
		}
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Simulate geocoding with sample data
		const place = samplePlaces.find((p) =>
			p.description.toLowerCase().includes(values.location.toLowerCase())
		)
		if (place) {
			const newPosition = {
				lat: place.geometry.location.lat,
				lng: place.geometry.location.lng
			}
			setMarkerPosition(newPosition)
			if (mapRef.current) {
				mapRef.current.panTo(newPosition)
			}
			form.setValue("location", place.description)
			toast({
				title: "Location Updated",
				description: `Selected location: ${place.description}`
			})
		} else {
			toast({
				title: "Location Not Found",
				description: "Please try a different search term.",
				variant: "destructive"
			})
		}
	}

	if (loadError) return <div>Error loading maps</div>
	if (!isLoaded) return <div>Loading maps</div>

	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader>
				<CardTitle>Location Picker</CardTitle>
				<CardDescription>
					Search for a location or use the map to select one.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<div className="flex space-x-2">
											<Input
												id="location-input"
												placeholder="Enter a location"
												{...field}
											/>
											<Button type="submit">
												<MapPin className="h-4 w-4" />
											</Button>
										</div>
									</FormControl>
									<FormDescription>
										Enter an address or drag the marker on the map.
									</FormDescription>
								</FormItem>
							)}
						/>

						<div className="overflow-hidden rounded-md">
							<GoogleMap
								mapContainerStyle={mapContainerStyle}
								zoom={14}
								center={markerPosition}
								onLoad={onMapLoad}
							>
								<Marker
									position={markerPosition}
									draggable={true}
									onDragEnd={onMarkerDragEnd}
								/>
							</GoogleMap>
						</div>

						<Button
							type="button"
							onClick={useCurrentLocation}
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Crosshair className="mr-2 h-4 w-4" />
							)}
							Use Current Location
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
