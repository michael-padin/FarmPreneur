export interface Product {
	id: string
	name: string
	price: number
	image: string
	unit: string
	farmer: Farmer
}

export interface Farmer {
	id: string
	name: string
	contactNumber: string
	addresses: Address[]
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

export interface Address {
	id: string
	fullAddress: string
	longitude: number
	latitude: number
	note: string
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
