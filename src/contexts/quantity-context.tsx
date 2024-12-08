"use client"

import React, { createContext, ReactNode, useContext, useState } from "react"

interface QuantityContextType {
	quantity: number
	setQuantity: React.Dispatch<React.SetStateAction<number>>
	stock: number
}

const QuantityContext = createContext<QuantityContextType | undefined>(
	undefined
)

export function QuantityProvider({
	children,
	stock
}: {
	children: ReactNode
	stock: number
}) {
	const [quantity, setQuantity] = useState(1)
	return (
		<QuantityContext.Provider value={{ quantity, setQuantity, stock }}>
			{children}
		</QuantityContext.Provider>
	)
}

export function useQuantity() {
	const context = useContext(QuantityContext)
	if (context === undefined) {
		throw new Error("useQuantity must be used within a QuantityProvider")
	}
	return context
}
