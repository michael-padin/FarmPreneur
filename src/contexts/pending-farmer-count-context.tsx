"use client"

import { getPendingFarmerCount } from "@/lib/actions"
import { pusherClient } from "@/lib/pusher"
import React, { createContext, useContext, useEffect, useState } from "react"

type PendingFarmerCountContextType = {
	pendingFarmerCount: number
	setPendingFarmerCount: React.Dispatch<React.SetStateAction<number>>
}

const PendingFarmerCountContext = createContext<
	PendingFarmerCountContextType | undefined
>(undefined)

export function PendingFarmerCountProvider({
	children
}: {
	children: React.ReactNode
}) {
	const [pendingFarmerCount, setPendingFarmerCount] = useState(0)

	useEffect(() => {
		getPendingFarmerCount().then((count) => setPendingFarmerCount(count))

		const channel = pusherClient.subscribe("pending-farmers-count")
		channel.bind("update", (data: { count: number }) => {
			setPendingFarmerCount(data.count)
		})

		return () => {
			pusherClient.unsubscribe("pending-farmers-count")
		}
	}, [])

	return (
		<PendingFarmerCountContext.Provider
			value={{ pendingFarmerCount, setPendingFarmerCount }}
		>
			{children}
		</PendingFarmerCountContext.Provider>
	)
}

export function usePendingFarmerCount() {
	const context = useContext(PendingFarmerCountContext)
	if (context === undefined) {
		throw new Error(
			"usePendingFarmerCount must be used within a UserCountProvider"
		)
	}
	return context
}
