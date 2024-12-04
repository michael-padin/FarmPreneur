import {
	Heart,
	Search,
	SlidersHorizontal,
	Home,
	ShoppingCart,
	Box,
	Wallet,
	User
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
export default function HomePageTest() {
	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar className="h-10 w-10 md:h-12 md:w-12">
							<AvatarImage src="/placeholder.svg" alt="User" />
							<AvatarFallback>AA</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm text-gray-500 md:text-base">
								Good Morning 👋
							</p>
							<h1 className="text-lg font-semibold md:text-xl">
								Andrew Ainsley
							</h1>
						</div>
					</div>
					<div className="flex gap-4">
						<button className="rounded-full p-2 hover:bg-gray-100">
							<Search className="h-6 w-6 text-gray-500" />
						</button>
						<button className="rounded-full p-2 hover:bg-gray-100">
							<Heart className="h-6 w-6 text-gray-500" />
						</button>
					</div>
				</div>
				{/* Search Bar */}
				<div className="mt-6 flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
						<Input
							className="h-12 rounded-full border-0 bg-gray-100 pl-10"
							placeholder="Search"
							type="search"
						/>
					</div>
					<Button
						size="icon"
						variant="outline"
						className="h-12 w-12 rounded-full"
					>
						<SlidersHorizontal className="h-5 w-5" />
					</Button>
				</div>
			</header>
			<main className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
				{/* Special Offers */}
				<section>
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-xl font-semibold md:text-2xl">
							Special Offers
						</h2>
						<Button
							variant="link"
							className="text-base font-semibold text-green-500 md:text-lg"
						>
							See All
						</Button>
					</div>
					<div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
						{["Prayer Plant", "ZZ Plant", "Monstera", "Aloe Vera"].map(
							(plant, index) => (
								<div key={index} className="group relative">
									<div className="aspect-square overflow-hidden rounded-3xl bg-gray-100">
										<Image
											src="/placeholder.svg"
											alt={plant}
											width={400}
											height={400}
											className="h-full w-full object-cover transition-transform group-hover:scale-105"
										/>
										<button className="absolute right-3 top-3 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white">
											<Heart className="h-5 w-5" />
										</button>
									</div>
									<div className="mt-4 space-y-2">
										<h3 className="text-lg font-semibold">{plant}</h3>
										<div className="flex items-center gap-2 text-sm">
											<span>⭐</span>
											<span>{(4 + Math.random()).toFixed(1)}</span>
											<span className="text-gray-500">
												({Math.floor(Math.random() * 3000 + 1000)} sold)
											</span>
										</div>
										<p className="text-lg font-semibold text-green-500">
											${Math.floor(Math.random() * 30 + 20)}
										</p>
									</div>
								</div>
							)
						)}
					</div>
				</section>
				{/* Most Popular */}
				<section>
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-xl font-semibold md:text-2xl">Most Popular</h2>
						<Button
							variant="link"
							className="text-base font-semibold text-green-500 md:text-lg"
						>
							See All
						</Button>
					</div>
					<div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
						<Button
							variant="default"
							className="rounded-full bg-green-500 hover:bg-green-600"
						>
							All
						</Button>
						{["Monstera", "Aloe", "Palm", "Tropical", "Cactus", "Fern"].map(
							(category, index) => (
								<Button key={index} variant="outline" className="rounded-full">
									{category}
								</Button>
							)
						)}
					</div>
				</section>
				{/* Popular Plants Grid */}
				<section className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="group relative">
							<div className="aspect-square overflow-hidden rounded-3xl bg-gray-100">
								<Image
									src="/placeholder.svg"
									alt={`Popular Plant ${i + 1}`}
									width={400}
									height={400}
									className="h-full w-full object-cover transition-transform group-hover:scale-105"
								/>
								<button className="absolute right-3 top-3 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white">
									<Heart className="h-5 w-5" />
								</button>
							</div>
							<div className="mt-4 space-y-2">
								<h3 className="text-lg font-semibold">Plant Name {i + 1}</h3>
								<div className="flex items-center gap-2 text-sm">
									<span>⭐</span>
									<span>{(4 + Math.random()).toFixed(1)}</span>
									<span className="text-gray-500">
										({Math.floor(Math.random() * 3000 + 1000)} sold)
									</span>
								</div>
								<p className="text-lg font-semibold text-green-500">
									${Math.floor(Math.random() * 30 + 20)}
								</p>
							</div>
						</div>
					))}
				</section>
			</main>
			{/* Bottom Navigation */}
			<nav className="fixed bottom-0 left-0 right-0 border-t bg-white md:hidden">
				<div className="flex justify-around p-4">
					{[
						{ icon: Home, label: "Home", active: true },
						{ icon: ShoppingCart, label: "Cart" },
						{ icon: Box, label: "Orders" },
						{ icon: Wallet, label: "Wallet" },
						{ icon: User, label: "Profile" }
					].map((item, index) => (
						<Link
							key={index}
							href="#"
							className={`flex flex-col items-center gap-1 ${
								item.active ? "text-green-500" : "text-gray-400"
							}`}
						>
							<item.icon className="h-6 w-6" />
							<span className="text-xs">{item.label}</span>
						</Link>
					))}
				</div>
			</nav>
		</div>
	)
}
