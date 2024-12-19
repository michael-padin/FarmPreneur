import { getProductBySlugUseCase } from "@/use-cases/products"
import { ImageResponse } from "next/og"

export const alt = "Product Details"
export const size = {
	width: 1200,
	height: 630
}
export const contentType = "image/png"

export default async function Image({ params }: { params: { slug: string } }) {
	const product = await getProductBySlugUseCase(params.slug)

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 48,
					background: "white",
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				{product.title}
			</div>
		),
		{
			...size,
			fonts: [
				{
					name: "Poppins",
					data: await fetch(
						new URL("../fonts/Inter-Bold.ttf", import.meta.url)
					).then((res) => res.arrayBuffer()),
					style: "normal",
					weight: 700
				}
			]
		}
	)
}
