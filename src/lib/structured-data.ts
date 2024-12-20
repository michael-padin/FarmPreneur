import { getProductBySlugUseCase } from "@/use-cases/products"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? process.env.NEXT_PUBLIC_BASE_URL
	: "http://localhost:3000"

export function generateProductJsonLd(
	product: Awaited<ReturnType<typeof getProductBySlugUseCase>>
) {
	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.title,
		description: product.description,
		image: product.productImages,
		offers: {
			"@type": "Offer",
			price: product.price,
			priceCurrency: "PHP",
			availability:
				product.quantity > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
			seller: {
				"@type": "Organization",
				name: product.farmer.name
			}
		},
		brand: {
			"@type": "Brand",
			name: "FarmPreneur"
		},
		category: product.category.name,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: product.reviews.averageRating,
			reviewCount: product.reviews.totalReviews
		},
		review: product.reviews.reviews.map((review) => ({
			"@type": "Review",
			reviewRating: {
				"@type": "Rating",
				ratingValue: review.rating
			},
			author: {
				"@type": "Person",
				name: review.customer?.name || "Customer"
			},
			reviewBody: review.comment,
			datePublished: review.createdAt
		}))
	}
}

export function generateHomeJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "FarmPreneur",
		url: baseUrl,

		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${baseUrl}/products?search={search_term_string}`
			},
			"query-input": "required name=search_term_string"
		},
		description:
			"Discover and purchase fresh, locally-grown produce from farmers in your area. Support local agriculture with FarmPreneur.",
		publisher: {
			"@type": "Organization",
			name: "FarmPreneur",
			logo: {
				"@type": "ImageObject",
				url: `${baseUrl}/logo.svg`
			}
		}
	}
}

export function generateOrganizationJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "FarmPreneur",
		url: baseUrl,
		logo: `${baseUrl}/logo.svg`,
		sameAs: [
			"https://www.facebook.com/mokiiiiieeeee",
			"https://www.instagram.com/mokiiiiieeeee",
			"https://x.com/mokiiiiieeeee"
		],
		contactPoint: [
			{
				"@type": "ContactPoint",
				telephone: "+639955143588",
				contactType: "customer service"
			}
		]
	}
}
