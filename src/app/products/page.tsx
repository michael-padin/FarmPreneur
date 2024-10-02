"use client"
import { ChevronDownIcon } from "lucide-react"
import Link from "next/link"
import Slider from "react-slick"

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { products } from "@/data"

import Navbar from "../_components/navbar"

const ProductsPage = () => {
	return (
		<div className="container mx-auto">
			<header className="fixed inset-x-0 top-0 z-10 border-b bg-white">
				<div className="container mx-auto flex h-20 items-center justify-between px-4">
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
			<div className="py-28">
				<div className="flex gap-5">
					<div className="flex w-[400px] flex-col gap-5">
						<div className="grid gap-2">
							<h2 className="text-xl font-semibold">Filters</h2>
							<Accordion collapsible type="single">
								<AccordionItem value="category">
									<AccordionTrigger className="text-base">
										Category
									</AccordionTrigger>
									<AccordionContent>
										<div className="grid gap-2">
											<Label className="flex items-center gap-2 font-normal">
												<Checkbox id="category-fruits" />
												Fruits{"\n                                "}
											</Label>
											<Label className="flex items-center gap-2 font-normal">
												<Checkbox id="category-vegetables" />
												Vegetables{"\n                                "}
											</Label>
											<Label className="flex items-center gap-2 font-normal">
												<Checkbox id="category-grains" />
												Grains{"\n                                "}
											</Label>
											<Label className="flex items-center gap-2 font-normal">
												<Checkbox id="category-dairy" />
												Dairy{"\n                                "}
											</Label>
										</div>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="price">
									<AccordionTrigger className="text-base">
										Price
									</AccordionTrigger>
									<AccordionContent>
										<div className="grid gap-4">
											{/* <Slider defaultValue={[10, 50]} max={100} step={1} /> */}
											<div className="flex items-center justify-between">
												<span>₱10</span>
												<span>₱100</span>
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="availability">
									<AccordionTrigger className="text-base">
										Availability
									</AccordionTrigger>
									<AccordionContent>
										<div className="grid gap-2">
											<Label className="flex items-center gap-2 font-normal">
												<Checkbox id="availability-in-stock" />
												In Stock{"\n                                "}
											</Label>
											<Label className="flex items-center gap-2 font-normal">
												<Checkbox id="availability-out-of-stock" />
												Out of Stock{"\n                                "}
											</Label>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
						<div className="grid gap-2">
							<h2 className="text-xl font-semibold">Sort By</h2>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className="w-full justify-between" variant="outline">
										<span>Newest</span>
										<ChevronDownIcon className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-full">
									<DropdownMenuRadioGroup value="newest">
										<DropdownMenuRadioItem value="newest">
											Newest
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="price-low-high">
											Price: Low to High
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="price-high-low">
											Price: High to Low
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="popularity">
											Popularity
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					{/* <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
					</div> */}
				</div>
			</div>
		</div>
	)
}

export default ProductsPage
