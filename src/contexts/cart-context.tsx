"use client"

import { groupCartItemsByFarmer } from "@/lib/utils"
import { CartItem, CartState, Product } from "@/types/cart"
import {
	createContext,
	use,
	useCallback,
	useContext,
	useMemo,
	useOptimistic,
	useRef
} from "react"

export interface CartContextType {
	cart: CartState
	addItem: (product: Product, quantity: number) => void
	removeItem: (itemId: string) => void
	updateQuantity: (itemId: string, quantity: number) => void
	clearCart: () => void
	hasCartChanged: boolean
}

const initialState: CartState = {
	items: [],
	groupedItems: [],
	totalItems: 0,
	distinctProductsCount: 0,
	total: 0
}

type CartAction =
	| { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
	| { type: "REMOVE_ITEM"; payload: { itemId: string } }
	| { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
	| { type: "CLEAR_CART" }

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD_ITEM": {
			const { product, quantity } = action.payload
			const existingItemIndex = state.items.findIndex(
				(item) => item.product.id === product.id
			)

			let updatedItems: CartItem[]
			if (existingItemIndex !== -1) {
				updatedItems = state.items.map((item, index) =>
					index === existingItemIndex
						? { ...item, quantity: item.quantity + quantity }
						: item
				)
			} else {
				updatedItems = [
					...state.items,
					{
						id: `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
						product,
						quantity
					}
				]
			}
			return updateCartState({ ...state, items: updatedItems })
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
	}
}

function updateCartState(state: CartState): CartState {
	const { totalItems, total, distinctProductsCount } = state.items.reduce(
		(acc, item) => ({
			totalItems: acc.totalItems + item.quantity,
			total: acc.total + item.quantity * item.product.price,
			distinctProductsCount: acc.distinctProductsCount + 1
		}),
		{ totalItems: 0, total: 0, distinctProductsCount: 0 }
	)

	const groupedItems = groupCartItemsByFarmer(state.items)

	return {
		...state,
		groupedItems,
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

	const hasCartChanged = useRef(false)

	const addItem = useCallback(
		(product: Product, quantity: number) => {
			hasCartChanged.current = true
			addOptimisticCart({
				type: "ADD_ITEM",
				payload: { product, quantity }
			})
		},
		[addOptimisticCart]
	)

	const removeItem = useCallback(
		(itemId: string) => {
			hasCartChanged.current = true
			addOptimisticCart({ type: "REMOVE_ITEM", payload: { itemId } })
		},
		[addOptimisticCart]
	)

	const updateQuantity = useCallback(
		(itemId: string, quantity: number) => {
			hasCartChanged.current = true
			addOptimisticCart({
				type: "UPDATE_QUANTITY",
				payload: { itemId, quantity }
			})
		},
		[addOptimisticCart]
	)

	const clearCart = useCallback(() => {
		hasCartChanged.current = true
		addOptimisticCart({ type: "CLEAR_CART" })
	}, [addOptimisticCart])

	const contextValue = useMemo(
		() => ({
			cart: optimisticCart,
			addItem,
			removeItem,
			updateQuantity,
			clearCart,
			hasCartChanged: hasCartChanged.current
		}),
		[optimisticCart, addItem, removeItem, updateQuantity, clearCart]
	)

	// // Reset hasCartChanged when the cart actually updates
	// if (optimisticCart !== prevCartRef.current) {
	// 	prevCartRef.current = optimisticCart
	// 	hasCartChanged.current = false
	// }

	return (
		<CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
	)
}

export function useCart() {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider")
	}
	return context
}
