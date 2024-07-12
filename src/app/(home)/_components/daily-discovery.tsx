import { products } from "@/data"
import Link from "next/link"
import ProductCard from "./product-card"

const DailyDiscovery = () => {
	return (
		<section className="container mx-auto rounded-lg px-0 py-5 lg:px-4">
			<div className="rounded-lg bg-background p-2">
				<h3 className="mb-2 font-semibold text-primary lg:text-2xl">
					Daily Discovery
				</h3>
				<div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
					{[...products, ...products, ...products].map((product, index) => (
						<ProductCard
							description={product.description}
							key={index}
							images={product.images}
							title={product.title}
							price={product.price}
							farmer={product.farm}
							unit={product.unit}
							className="border-none shadow-none"
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default DailyDiscovery
