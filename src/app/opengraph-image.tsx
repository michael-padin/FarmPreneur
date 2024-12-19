import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "FarmPreneur"

export const size = {
	width: 1200,
	height: 630
}

export const contentType = "image/png"

export default async function Image() {
	const { title } = {
		...{
			title: process.env.SITE_NAME
		}
	}

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 128,
					background: "white",
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<p tw="mt-12 text-6xl font-bold text-primary">{title}</p>
			</div>
		),
		{
			...size,
			fonts: [
				{
					name: "Inter",
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
