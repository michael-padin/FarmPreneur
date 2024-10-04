"use client"
import { useState } from "react"
import { Minus, Plus, ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Recommend from "../../_components/recommend"
import Link from "next/link"

export default function CartListPage() {
	const [cartItems, setCartItems] = useState([
		{
			id: 1,
			name: "Fresh Mangoes",
			price: 120,
			quantity: 2,
			image: "/placeholder.svg?height=80&width=80"
		},
		{
			id: 2,
			name: "Organic Rice (5kg)",
			price: 250,
			quantity: 1,
			image: "/placeholder.svg?height=80&width=80"
		},
		{
			id: 3,
			name: "Coconuts",
			price: 45,
			quantity: 3,
			image: "/placeholder.svg?height=80&width=80"
		}
	])

	const updateQuantity = (id: number, change: number) => {
		setCartItems((items) =>
			items
				.map((item) =>
					item.id === id
						? { ...item, quantity: Math.max(0, item.quantity + change) }
						: item
				)
				.filter((item) => item.quantity > 0)
		)
	}

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)
	const deliveryFee = 50
	const total = subtotal + deliveryFee

	return (
		<div className="min-h-screen bg-gray-100 pb-20">
			<header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
				<div className="flex items-center">
					<Button variant="ghost" size="icon" className="mr-2">
						<ChevronLeft className="h-6 w-6" />
					</Button>
					<h1 className="text-lg font-semibold">Cart ({cartItems.length})</h1>
				</div>
			</header>

			<main className="container mx-auto px-0 py-8">
				<ul className="space-y-2 px-2">
					{cartItems.map((item) => (
						<li
							key={item.id}
							className="flex items-center rounded-lg bg-white p-4 shadow"
						>
							<img
								src={item.image}
								alt={item.name}
								className="mr-4 h-20 w-20 rounded-md object-cover"
							/>
							<div className="flex-grow">
								<h3 className="font-semibold">{item.name}</h3>
								<p className="font-medium text-green-600">₱{item.price}</p>
								<div className="mt-2 flex items-center">
									<Button
										variant="outline"
										size="icon"
										onClick={() => updateQuantity(item.id, -1)}
									>
										<Minus className="h-4 w-4" />
									</Button>
									<span className="mx-2 font-semibold">{item.quantity}</span>
									<Button
										variant="outline"
										size="icon"
										onClick={() => updateQuantity(item.id, 1)}
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => updateQuantity(item.id, -item.quantity)}
							>
								<X className="h-5 w-5 text-gray-500" />
							</Button>
						</li>
					))}
				</ul>

				<div className="px-2">
					<div className="mt-6 rounded-lg bg-white p-4 shadow">
						<h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
						<div className="mb-2 flex justify-between">
							<span>Subtotal</span>
							<span>₱{subtotal}</span>
						</div>
						<div className="mb-2 flex justify-between">
							<span>Delivery Fee</span>
							<span>₱{deliveryFee}</span>
						</div>
						<div className="mt-4 flex justify-between text-lg font-semibold">
							<span>Total</span>
							<span>₱{total}</span>
						</div>
					</div>
				</div>

				{/* <div className="px-2">
					<Button className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700">
						Proceed to Checkout
					</Button>
				</div> */}

				<section className="mt-12">
					<div className="">
						<div className="mt-2 flex justify-between p-2">
							<h3>You May Also Like</h3>
							<p>See all</p>
						</div>
						<div className="bg-background p-2">
							<Recommend />
						</div>
					</div>
				</section>
			</main>

			<footer className="shadow-up fixed bottom-0 left-0 right-0 z-50 bg-white p-4">
				<Button
					className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
					asChild
				>
					<Link href="/proceed-checkout">Checkout (₱{total})</Link>
				</Button>
			</footer>
		</div>
	)
}
