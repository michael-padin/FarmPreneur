export interface Product {
	id: string
	name: string
	price: number
	image: string
	pickupLocation: PickupLocation
	unit: string
	farmer: Farmer
}

export interface Farmer {
	id: string
	name: string
}

export interface PickupLocation {
	id: string
	fullAddress: string
	latitude: number
	longitude: number
}

export interface CartItem {
	id: string
	product: Product
	quantity: number
}
export interface GroupedCartItem {
	farmer: Farmer
	items: CartItem[]
}

export interface CartState {
	items: CartItem[]
	groupedItems: GroupedCartItem[]
	totalItems: number
	total: number
	distinctProductsCount: number
}
