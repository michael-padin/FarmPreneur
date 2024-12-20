import { getProductsOnProductListPageUseCase } from "@/use-cases/products"
import { MetadataRoute } from "next"

export const dynamic = "force-dynamic"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? process.env.NEXT_PUBLIC_BASE_URL
	: "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const productUrls = await getProductsOnProductListPageUseCase({}).then(
		(products) =>
			products.map((product) => ({
				url: `${baseUrl}/products/${product.slug}`,
				lastModified: product.updatedAt,
				priority: 0.5
			}))
	)

	return [
		{
			url: `${baseUrl}`,
			lastModified: new Date(),
			images: [`${baseUrl}/logo.svg`],
			changeFrequency: "hourly",
			priority: 1
		},
		{
			url: `${baseUrl}/products`,
			lastModified: new Date(),
			changeFrequency: "hourly",
			priority: 0.8
		},
		...productUrls
	]
}
