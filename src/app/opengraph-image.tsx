import { ImageResponse } from "next/og"

export const runtime = "edge"

export default async function Image() {
	const { title } = {
		...{
			title: process.env.SITE_NAME
		}
	}

	const logoSrc = await fetch(
		new URL("../components/logo.svg", import.meta.url)
	).then((res) => res.arrayBuffer())

	return new ImageResponse(
		(
			<div tw="flex h-full w-full flex-col items-center justify-center bg-black">
				<div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
					<img src={logoSrc} height="100" />
				</div>
				<p tw="mt-12 text-6xl font-bold text-white">{title}</p>
			</div>
		),
		{
			width: 1200,
			height: 630,
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
