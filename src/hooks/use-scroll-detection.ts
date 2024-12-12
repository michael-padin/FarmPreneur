import { useEffect, useState } from "react"

interface UseScrollDetectionOptions {
	threshold?: number
	throttleMs?: number
}

export function useScrollDetection({
	threshold = 60,
	throttleMs = 100
}: UseScrollDetectionOptions = {}) {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > threshold
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled)
			}
		}

		document.addEventListener("scroll", handleScroll, { passive: true })

		return () => {
			document.removeEventListener("scroll", handleScroll)
		}
	}, [scrolled, threshold, throttleMs])

	return scrolled
}
