import { Apple, Banana, Carrot, Vegan } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { categories, products } from "@/data"
import { cn } from "@/lib/utils"

import CategoryCard from "./_components/category-card"
import Footer from "./_components/footer"
import Navbar from "./_components/navbar"
import ProductCard from "./_components/product-card"

const Home = async () => {
	return (
		<>
			<header className="fixed inset-x-0 top-0 z-10 border-b bg-white">
				<div className="container mx-auto flex h-20 items-center justify-between px-4 ">
					<Link
						className="flex items-center gap-2 text-3xl font-black text-[#404145]"
						href="/"
					>
						<img src="/logo.svg" alt="" className="h-[50px] w-[50px]" />
						Farm2go
					</Link>
					<Navbar />
				</div>
			</header>
			<main className="">
				<section className=" m-auto w-full pb-6 pt-24 ">
					{/* <div className="absolute  inset-0  bg-black/20 backdrop-blur-sm"></div> */}
					<div className="container relative  mx-auto h-full rounded-lg bg-primary  px-4 md:px-6">
						<div className="my-4 flex items-center  justify-center py-20">
							<Vegan
								className="absolute -bottom-5 left-10 h-32 w-32 stroke-white"
								strokeWidth={1}
							/>
							<Carrot
								className="absolute -bottom-5 right-10 h-32 w-32 stroke-white"
								strokeWidth={1}
							/>
							<Banana
								className="absolute -bottom-5 right-60 h-32 w-32 stroke-white"
								strokeWidth={1}
							/>
							<Apple
								className="absolute -bottom-5 left-60 h-32 w-32 stroke-white"
								strokeWidth={1}
							/>

							<div className="relative space-y-10 text-center text-white">
								<h1 className="text-3xl font-bold leading-normal tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Discover the Best Local Produce
								</h1>
								<p className="mx-auto max-w-[700px] md:text-xl">
									Connect directly with farmers and get the freshest,
									highest-quality produce delivered to your door.
								</p>
								<div className="m-auto flex w-2/3 justify-center gap-2 rounded-lg bg-white p-2">
									<Input
										placeholder="Search products"
										className={`${cn("border-none text-black focus-visible:ring-transparent")}`}
									/>
									<Button>Search</Button>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="container mx-auto px-4">
					<div className="flex  justify-between">
						<h2 className="mb-4 text-2xl font-bold">Featured Products</h2>
						<Link
							href="/products"
							className="leading-normal text-primary underline-offset-2 hover:underline"
						>
							See all
						</Link>
					</div>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{products.map((product, index) => (
							<ProductCard
								description={product.description}
								key={index}
								images={product.images}
								title={product.title}
								price={product.price}
								farmer={product.farm}
								unit={product.unit}
							/>
						))}
					</div>
				</section>
				<section className="container mx-auto mt-8 px-4">
					<h2 className="mb-4 text-2xl font-bold">Browse by Category</h2>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{categories.map((category, index) => (
							<CategoryCard
								key={index}
								image={category.image}
								title={category.title}
								description={category.description}
								link={category.link}
							/>
						))}
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}

export default Home
