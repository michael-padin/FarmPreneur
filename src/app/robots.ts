import { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? process.env.NEXT_PUBLIC_BASE_URL
	: "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/dashboard/",
					"/profile/",
					"/orders/",
					"/cart/",
					"/notifications/"
				]
			}
		],
		sitemap: `${baseUrl}/sitemap.xml`
	}
}
