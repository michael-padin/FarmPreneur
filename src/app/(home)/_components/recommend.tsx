import { products } from "@/data"
import ProductCard from "./product-card"

const Recommend = () => {
	return (
		<div>
			<div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
				{[...products, ...products, ...products].map((product, index) => (
					<ProductCard
						description={product.description}
						key={index}
						images={product.images}
						title={product.title}
						price={product.price}
						farmer={product.farmerDetails}
						unit={product.unit}
						className="border-none shadow-none"
					/>
				))}
			</div>
		</div>
	)
}

export default Recommend
