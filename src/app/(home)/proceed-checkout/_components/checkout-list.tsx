"use client"
import { useState } from "react"
import { ChevronLeft, CreditCard, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
import { format } from "date-fns"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function PickupCheckoutPageList() {
	const router = useRouter()
	const [paymentMethod, setPaymentMethod] = useState("card")
	const [pickupDate, setPickupDate] = useState<Date>()

	const cartItems = [
		{ id: 1, name: "Fresh Mangoes", price: 120, quantity: 2 },
		{ id: 2, name: "Organic Rice (5kg)", price: 250, quantity: 1 },
		{ id: 3, name: "Coconuts", price: 45, quantity: 3 }
	]

	const total = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)

	return (
		<div className="min-h-screen bg-gray-100 pb-20">
			<header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
				<div className="flex items-center">
					<Button variant="ghost" size="icon" className="mr-2" asChild>
						<Link href={`/cart`}>
							<ChevronLeft className="h-6 w-6" />
						</Link>
					</Button>
					<h1 className="text-lg font-semibold">Back</h1>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<form
					className="space-y-8"
					onSubmit={(e) => {
						e.preventDefault()
						toast("Submitted", {
							description: "Your order has been submitted successfully."
						})
						router.push("/")
					}}
				>
					{/* <section className="rounded-lg bg-white p-6 shadow">
						<h2 className="mb-4 text-xl font-semibold">Pickup Information</h2>
						<div className="space-y-4">
							<div>
								<Label htmlFor="pickupLocation">Pickup Location</Label>
								<Select required>
									<SelectTrigger id="pickupLocation">
										<SelectValue placeholder="Select pickup location" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="cubao">Cubao Farmers Market</SelectItem>
										<SelectItem value="makati">
											Makati Weekend Market
										</SelectItem>
										<SelectItem value="taguig">
											Taguig Greenfield Weekend Market
										</SelectItem>
										<SelectItem value="quezon-city">
											Quezon City Circle Sunday Market
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Pickup Date</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={`w-full justify-start text-left font-normal ${!pickupDate && "text-muted-foreground"}`}
										>
											<Calendar className="mr-2 h-4 w-4" />
											{pickupDate ? format(pickupDate, "PPP") : "Select date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<CalendarComponent
											mode="single"
											selected={pickupDate}
											onSelect={setPickupDate}
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div>
								<Label htmlFor="pickupTime">Pickup Time</Label>
								<Select required>
									<SelectTrigger id="pickupTime">
										<SelectValue placeholder="Select pickup time" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="morning">
											Morning (8:00 AM - 11:00 AM)
										</SelectItem>
										<SelectItem value="afternoon">
											Afternoon (1:00 PM - 4:00 PM)
										</SelectItem>
										<SelectItem value="evening">
											Evening (5:00 PM - 8:00 PM)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="name">Full Name</Label>
								<Input id="name" placeholder="Juan Dela Cruz" required />
							</div>
							<div>
								<Label htmlFor="phone">Phone Number</Label>
								<Input
									id="phone"
									type="tel"
									placeholder="09123456789"
									required
								/>
							</div>
						</div>
					</section>

					<section className="rounded-lg bg-white p-6 shadow">
						<h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
						<RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
							<div className="mb-2 flex items-center space-x-2">
								<RadioGroupItem value="card" id="card" />
								<Label htmlFor="card" className="flex items-center">
									<CreditCard className="mr-2 h-4 w-4" />
									Credit/Debit Card
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="cash" id="cash" />
								<Label htmlFor="cash" className="flex items-center">
									<MapPin className="mr-2 h-4 w-4" />
									Cash on Pickup
								</Label>
							</div>
						</RadioGroup>
						{paymentMethod === "card" && (
							<div className="mt-4 space-y-4">
								<div>
									<Label htmlFor="cardNumber">Card Number</Label>
									<Input
										id="cardNumber"
										placeholder="1234 5678 9012 3456"
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="expiryDate">Expiry Date</Label>
										<Input id="expiryDate" placeholder="MM/YY" required />
									</div>
									<div>
										<Label htmlFor="cvv">CVV</Label>
										<Input id="cvv" placeholder="123" required />
									</div>
								</div>
							</div>
						)}
					</section> */}

					<section className="rounded-lg bg-white p-6 shadow">
						<h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
						<ul className="mb-4 space-y-2">
							{cartItems.map((item) => (
								<li key={item.id} className="flex justify-between">
									<span>
										{item.name} x {item.quantity}
									</span>
									<span>₱{item.price * item.quantity}</span>
								</li>
							))}
						</ul>
						<div className="border-t pt-4">
							<div className="flex justify-between text-lg font-semibold">
								<span>Total</span>
								<span>₱{total}</span>
							</div>
						</div>
					</section>

					<Button
						type="submit"
						className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
					>
						Place Order for Pickup (₱{total})
					</Button>
				</form>
			</main>
		</div>
	)
}
