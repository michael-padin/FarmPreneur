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
		sku: "",
		mpn: "",
		gtin: "",
		offers: {
			"@type": "Offer",
			price: product.price,
			priceValidUntil: new Date().setFullYear(new Date().getFullYear() + 1), // Price valid for 1 year
			priceCurrency: "PHP",
			url: `${baseUrl}/products/${product.slug}`,
			availability:
				product.quantity > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
			itemCondition: "https://schema.org/NewCondition",
			seller: {
				"@type": "Organization",
				name: product.farmer.name,
				seller: {
					"@type": "Organization",
					name: product.farmer.name,
					url: `${baseUrl}/farmers/${product.farmer.id}`
				}
			}
		},
		brand: {
			"@type": "Brand",
			name: "FarmPreneur",
			url: `${baseUrl}`,
			logo: `${baseUrl}/logo.svg`
		},
		category: product.category.name,
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@id": `${baseUrl}`,
						name: "Home"
					}
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": `${baseUrl}/categories/${product.category.slug}`,
						name: product.category.name
					}
				},
				{
					"@type": "ListItem",
					position: 3,
					item: {
						"@id": `${baseUrl}/products/${product.slug}`,
						name: product.title
					}
				}
			]
		},

		// Enhanced aggregate rating
		aggregateRating:
			product.reviews.totalReviews > 0
				? {
						"@type": "AggregateRating",
						ratingValue: product.reviews.averageRating,
						reviewCount: product.reviews.totalReviews,
						bestRating: 5,
						worstRating: 1
					}
				: undefined,
		review: product.reviews.reviews.map((review) => ({
			"@type": "Review",
			reviewRating: {
				"@type": "Rating",
				ratingValue: review.rating,
				bestRating: 5,
				worstRating: 1
			},
			author: {
				"@type": "Person",
				name: review.customer?.name || "Anonymous Customer"
			},
			reviewBody: review.comment,
			datePublished: review.createdAt,
			publisher: {
				"@type": "Organization",
				name: "FarmPreneur"
			}
		})), // Add additional product metadata
		additionalProperty: [
			{
				"@type": "PropertyValue",
				name: "Farm Location",
				value: product.farmer.addresses[0].fullAddress || undefined
			},
			{
				"@type": "PropertyValue",
				name: "Farming Method",
				value: "Organic Farming"
			}
		].filter((prop) => prop.value !== undefined),
		datePublished: product.createdAt,
		dateModified: product.updatedAt
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
