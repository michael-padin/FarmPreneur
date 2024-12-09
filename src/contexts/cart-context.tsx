"use client"

import { groupCartItemsByFarmerAndLocation } from "@/lib/utils"
import { CartState, GroupedCartItem, Product } from "@/types/cart"
import crypto from "crypto"
import { createContext, use, useContext, useOptimistic } from "react"

export interface CartContextType {
	cart: CartState
	addItem: (product: Product, quantity: number) => void
	removeItem: (itemId: string) => void
	updateQuantity: (itemId: string, quantity: number) => void
	clearCart: () => void
	groupedCart: GroupedCartItem[]
}

const initialState: CartState = {
	items: [],
	totalItems: 0,
	distinctProductsCount: 0,
	total: 0
}

type CartAction =
	| {
			type: "ADD_ITEM"
			payload: { product: Product; quantity: number }
	  }
	| { type: "REMOVE_ITEM"; payload: { itemId: string } }
	| {
			type: "UPDATE_QUANTITY"
			payload: { itemId: string; quantity: number }
	  }
	| { type: "CLEAR_CART" }

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD_ITEM": {
			const { product, quantity } = action.payload

			const existingItemIndex = state.items.findIndex(
				(item) => item.product.id === product.id
			)

			let updatedItems
			if (existingItemIndex !== -1) {
				// Update quantity if item already exists
				updatedItems = state.items.map((item, index) =>
					index === existingItemIndex
						? {
								...item,
								quantity: item.quantity + quantity
							}
						: item
				)
				return updateCartState({ ...state, items: updatedItems })
			} else {
				// Add new item to the cart
				updatedItems = [...state.items, product]
				return updateCartState({
					...state,
					items: [
						...state.items,
						{ id: crypto.randomUUID(), product, quantity }
					]
				})
			}
		}
		case "REMOVE_ITEM": {
			const { itemId } = action.payload
			const updatedItems = state.items.filter((item) => item.id !== itemId)
			return updateCartState({ ...state, items: updatedItems })
		}
		case "UPDATE_QUANTITY": {
			const { itemId, quantity } = action.payload
			const updatedItems = state.items.map((item) =>
				item.id === itemId ? { ...item, quantity } : item
			)
			return updateCartState({ ...state, items: updatedItems })
		}
		case "CLEAR_CART": {
			return initialState
		}
		default:
			return state
	}
}

function updateCartState(state: CartState): CartState {
	const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
	const total = state.items.reduce(
		(sum, item) => sum + item.quantity * item.product.price,
		0
	)

	const distinctProductsCount = state.items.length

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

	const groupedCart = groupCartItemsByFarmerAndLocation(optimisticCart.items)

	const addItem = (product: Product, quantity: number) => {
		addOptimisticCart({
			type: "ADD_ITEM",
			payload: { product, quantity }
		})
	}

	const removeItem = (itemId: string) => {
		addOptimisticCart({ type: "REMOVE_ITEM", payload: { itemId } })
	}

	const updateQuantity = (itemId: string, quantity: number) => {
		addOptimisticCart({
			type: "UPDATE_QUANTITY",
			payload: { itemId, quantity }
		})
	}

	const clearCart = () => {
		addOptimisticCart({ type: "CLEAR_CART" })
	}

	return (
		<CartContext.Provider
			value={{
				cart: optimisticCart,
				groupedCart,
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
