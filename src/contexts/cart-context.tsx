"use client"

import { CartFarmer, CartState, Farmer, Product } from "@/types/cart"
import { createContext, use, useContext, useOptimistic } from "react"

export interface CartContextType {
	cart: CartState
	addItem: (farmer: Farmer, product: Product, quantity: number) => void
	removeItem: (farmerId: string, itemId: string) => void
	updateQuantity: (farmerId: string, itemId: string, quantity: number) => void
	clearCart: () => void
}

const initialState: CartState = {
	farmers: [],
	totalItems: 0,
	distinctProductsCount: 0,
	total: 0
}

type CartAction =
	| {
			type: "ADD_ITEM"
			payload: { farmer: Farmer; product: Product; quantity: number }
	  }
	| { type: "REMOVE_ITEM"; payload: { farmerId: string; itemId: string } }
	| {
			type: "UPDATE_QUANTITY"
			payload: { farmerId: string; itemId: string; quantity: number }
	  }
	| { type: "CLEAR_CART" }

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD_ITEM": {
			const { farmer, product, quantity } = action.payload
			const farmerIndex = state.farmers.findIndex(
				(f) => f.farmer.id === farmer.id
			)

			if (farmerIndex > -1) {
				const itemIndex = state.farmers[farmerIndex].items.findIndex(
					(item) => item.product.id === product.id
				)
				if (itemIndex > -1) {
					// Update existing item
					const updatedFarmers = state.farmers.map((f, index) =>
						index === farmerIndex
							? {
									...f,
									items: f.items.map((item, idx) =>
										idx === itemIndex
											? { ...item, quantity: item.quantity + quantity }
											: item
									)
								}
							: f
					)
					return updateCartState({ ...state, farmers: updatedFarmers })
				} else {
					// Add new item to existing farmer
					const updatedFarmers = state.farmers.map((f, index) =>
						index === farmerIndex
							? {
									...f,
									items: [
										...f.items,
										{ id: crypto.randomUUID(), product, quantity }
									]
								}
							: f
					)
					return updateCartState({ ...state, farmers: updatedFarmers })
				}
			} else {
				// Add new farmer and item
				const newFarmer: CartFarmer = {
					farmer,
					items: [{ id: crypto.randomUUID(), product, quantity }]
				}
				return updateCartState({
					...state,
					farmers: [...state.farmers, newFarmer]
				})
			}
		}
		case "REMOVE_ITEM": {
			const { farmerId, itemId } = action.payload
			const updatedFarmers = state.farmers
				.map((f) =>
					f.farmer.id === farmerId
						? { ...f, items: f.items.filter((item) => item.id !== itemId) }
						: f
				)
				.filter((f) => f.items.length > 0)
			return updateCartState({ ...state, farmers: updatedFarmers })
		}
		case "UPDATE_QUANTITY": {
			const { farmerId, itemId, quantity } = action.payload
			const updatedFarmers = state.farmers.map((f) =>
				f.farmer.id === farmerId
					? {
							...f,
							items: f.items.map((item) =>
								item.id === itemId ? { ...item, quantity } : item
							)
						}
					: f
			)
			return updateCartState({ ...state, farmers: updatedFarmers })
		}
		case "CLEAR_CART": {
			return initialState
		}
		default:
			return state
	}
}

function updateCartState(state: CartState): CartState {
	const totalItems = state.farmers.reduce(
		(sum, farmer) =>
			sum + farmer.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
		0
	)
	const total = state.farmers.reduce(
		(sum, farmer) =>
			sum +
			farmer.items.reduce(
				(itemSum, item) => itemSum + item.product.price * item.quantity,
				0
			),
		0
	)

	const distinctProductsCount = state.farmers.reduce(
		(sum, farmer) => sum + farmer.items.length,
		0
	)

	return {
		...state,
		totalItems,
		total,
		distinctProductsCount
	}
}

export function CartProvider({
	children,
	initialCartPromise
}: {
	children: React.ReactNode
	initialCartPromise: Promise<CartState>
}) {
	const initialCart = use(initialCartPromise)
	const [optimisticCart, addOptimisticCart] = useOptimistic(
		initialCart,
		cartReducer
	)

	const addItem = (farmer: Farmer, product: Product, quantity: number) => {
		addOptimisticCart({
			type: "ADD_ITEM",
			payload: { farmer, product, quantity }
		})
	}

	const removeItem = (farmerId: string, itemId: string) => {
		addOptimisticCart({ type: "REMOVE_ITEM", payload: { farmerId, itemId } })
	}

	const updateQuantity = (
		farmerId: string,
		itemId: string,
		quantity: number
	) => {
		addOptimisticCart({
			type: "UPDATE_QUANTITY",
			payload: { farmerId, itemId, quantity }
		})
	}

	const clearCart = () => {
		addOptimisticCart({ type: "CLEAR_CART" })
	}

	return (
		<CartContext.Provider
			value={{
				cart: optimisticCart,
				addItem,
				removeItem,
				updateQuantity,
				clearCart
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

export function useCart() {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider")
	}
	return context
}
