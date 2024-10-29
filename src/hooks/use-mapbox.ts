import { useRef, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"

interface UseMapboxProps {
	mapboxApiKey: string
	defaultCenter: { lng: number; lat: number }
	defaultZoom?: number
	onMarkerDragEnd?: (lngLat: mapboxgl.LngLat) => void
	draggable?: boolean
}

export function useMapbox({
	mapboxApiKey,
	defaultCenter,
	defaultZoom = 14,
	onMarkerDragEnd,
	draggable = false
}: UseMapboxProps) {
	const mapRef = useRef<mapboxgl.Map | null>(null)
	const markerRef = useRef<mapboxgl.Marker | null>(null)

	const initializeMap = useCallback(
		(container: HTMLElement) => {
			mapboxgl.accessToken = mapboxApiKey

			const zoom = mapRef.current?.getZoom() || defaultZoom
			const center = defaultCenter || mapRef.current?.getCenter()
			mapRef.current = new mapboxgl.Map({
				container,
				style: "mapbox://styles/mokiiiiieeeee/cm2nggekh003c01r4b330fpox",
				center: center,
				zoom: zoom,
				projection: "mercator",
				attributionControl: false,
				// pitch: 60,
				pitchWithRotate: true
			})
			// mapRef.current.addControl(
			// 	new mapboxgl.GeolocateControl({
			// 		positionOptions: {
			// 			enableHighAccuracy: true
			// 		},
			// 		trackUserLocation: true,
			// 		showUserHeading: false
			// 	})
			// )
			mapRef.current.addControl(
				new mapboxgl.NavigationControl({
					visualizePitch: true
				})
			)

			markerRef.current = new mapboxgl.Marker({
				draggable,
				color: "#16a34a"
			})
				.setLngLat([defaultCenter.lng, defaultCenter.lat])
				.addTo(mapRef.current)

			markerRef.current.on("dragend", () => {
				const lngLat = markerRef.current!.getLngLat()
				onMarkerDragEnd?.(lngLat)
			})

			mapRef.current.on("load", () => {
				mapRef.current?.resize()
			})
		},
		[defaultCenter, defaultZoom, draggable, mapboxApiKey, onMarkerDragEnd]
	)

	const updateMarkerPosition = useCallback((lng: number, lat: number) => {
		if (mapRef.current && markerRef.current) {
			mapRef.current.flyTo({
				center: [lng, lat]
			})
			markerRef.current.setLngLat([lng, lat])
		}
	}, [])

	// useEffect(() => {
	// 	return () => {
	// 		if (mapRef.current) {
	// 			mapRef.current.remove()
	// 			mapRef.current = null
	// 		}
	// 	}
	// }, [])

	return {
		map: mapRef,
		marker: markerRef,
		initializeMap,
		updateMarkerPosition
	}
}
