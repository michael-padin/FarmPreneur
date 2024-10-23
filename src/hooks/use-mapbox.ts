import { useEffect, useRef, useCallback } from "react"
import mapboxgl from "mapbox-gl"

interface UseMapboxProps {
	mapboxApiKey: string
	defaultCenter: { lng: number; lat: number }
	defaultZoom: number
	onMarkerDragEnd: (lngLat: mapboxgl.LngLat) => void
}

export function useMapbox({
	mapboxApiKey,
	defaultCenter,
	defaultZoom,
	onMarkerDragEnd
}: UseMapboxProps) {
	const mapRef = useRef<mapboxgl.Map | null>(null)
	const markerRef = useRef<mapboxgl.Marker | null>(null)

	const initializeMap = useCallback(
		(container: HTMLElement) => {
			if (mapRef.current) return

			mapboxgl.accessToken = mapboxApiKey

			mapRef.current = new mapboxgl.Map({
				container,
				style: "mapbox://styles/mapbox/standard-satellite",
				center: [defaultCenter.lng, defaultCenter.lat],
				zoom: defaultZoom
			})

			markerRef.current = new mapboxgl.Marker({
				draggable: true,
				color: "#16a34a"
			})
				.setLngLat([defaultCenter.lng, defaultCenter.lat])
				.addTo(mapRef.current)

			markerRef.current.on("dragend", () => {
				const lngLat = markerRef.current!.getLngLat()
				onMarkerDragEnd(lngLat)
			})

			mapRef.current.on("load", () => {
				mapRef.current?.resize()
			})
		},
		[mapboxApiKey, defaultCenter, defaultZoom, onMarkerDragEnd]
	)

	const updateMarkerPosition = useCallback((lng: number, lat: number) => {
		if (mapRef.current && markerRef.current) {
			mapRef.current.flyTo({
				center: [lng, lat],
				zoom: 14
			})
			markerRef.current.setLngLat([lng, lat])
		}
	}, [])

	useEffect(() => {
		return () => {
			if (mapRef.current) {
				mapRef.current.remove()
				mapRef.current = null
			}
		}
	}, [])

	return {
		map: mapRef,
		marker: markerRef,
		initializeMap,
		updateMarkerPosition
	}
}
