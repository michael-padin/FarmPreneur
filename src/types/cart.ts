export interface Product {
	id: string
	name: string
	price: number
	image: string
	unit: string
}

export interface Farmer {
	id: string
	name: string
}

export interface CartItem {
	id: string
	product: Product
	quantity: number
}

export interface CartFarmer {
	farmer: Farmer
	items: CartItem[]
}

export interface CartState {
	farmers: CartFarmer[]
	totalItems: number
	total: number
	distinctProductsCount: number
}
