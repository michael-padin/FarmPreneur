"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Monitor, Smartphone } from "lucide-react"
import { Session } from "next-auth"
import { useEffect, useState } from "react"

interface DeviceRestrictionProps {
	children: React.ReactNode
	user?: Session["user"]
	role: "ADMIN" | "FARMER" | "CUSTOMER"
}

export function DeviceRestriction({
	children,
	user,
	role
}: DeviceRestrictionProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const [mounted, setMounted] = useState(false)
	const isLoggedIn = !!user

	useEffect(() => {
		setMounted(true)
	}, [])

	// Don't render anything during SSR to prevent hydration mismatch
	if (!mounted) return null

	// For admin, only allow desktop view
	if (role === "ADMIN" && !isDesktop) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
				<div className="w-full max-w-lg rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="text-center">
						<Monitor className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
						<h1 className="mb-2 text-2xl font-semibold text-foreground">
							Desktop View Required
						</h1>
						<p className="mb-6 text-muted-foreground">
							The admin dashboard is optimized for desktop viewing only. Please
							access this page from a desktop or laptop computer.
						</p>
						<div className="rounded-md bg-muted p-4">
							<p className="text-sm text-muted-foreground">
								For security and optimal experience, administrative functions
								require a larger screen.
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	// For farmers and logged-in customers, only allow mobile view
	if ((role === "FARMER" || (role === "CUSTOMER" && isLoggedIn)) && isDesktop) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
				<div className="w-full max-w-lg rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="text-center">
						<Smartphone className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
						<h1 className="mb-2 text-2xl font-semibold text-foreground">
							Mobile View Only
						</h1>
						<p className="mb-6 text-muted-foreground">
							This section is optimized for mobile viewing only. Please access
							using a mobile device or resize your browser window.
						</p>
						<div className="rounded-md bg-muted p-4">
							<p className="text-sm text-muted-foreground">
								For the best experience, please view this content on a mobile
								device or reduce your browser window width to less than 768
								pixels.
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	// For non-logged-in customers, allow both mobile and desktop views
	if (role === "CUSTOMER" && !isLoggedIn) {
		return <>{children}</>
	}

	// Otherwise, render the children
	return <>{children}</>
}
