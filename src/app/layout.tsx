import { NuqsAdapter } from "nuqs/adapters/next/app"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import "./globals.css"

import { Toaster } from "@/components/ui/sonner"
import { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Providers } from "./providers"

const inter = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"]
})

import ogImage from "./opengraph-image.png"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? process.env.NEXT_PUBLIC_BASE_URL
	: "http://localhost:3000"

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "FarmPreneur - Local Farmers Marketplace",
		template: "FarmPreneur - %s"
	},
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
		yandex: "yandex",
		yahoo: "yahoo",
		other: {
			me: ["padinmichael201@gmail.com"]
		}
	},
	description:
		"Discover and purchase fresh, locally-grown produce from farmers in your area. Support local agriculture with FarmPreneur.",
	keywords: [
		"local produce",
		"farmers market",
		"fresh vegetables",
		"farm to table",
		"sustainable agriculture"
	],
	robots: {
		index: true,
		follow: true
	},
	authors: [{ name: "FarmPreneur Team" }],
	creator: "FarmPreneur",
	publisher: "FarmPreneur",
	formatDetection: {
		email: false,
		address: false,
		telephone: false
	},
	openGraph: {
		type: "website",
		url: baseUrl,
		siteName: "FarmPreneur",
		images: [
			{
				url: ogImage.src,
				width: ogImage.width,
				height: ogImage.height,
				alt: "FarmPreneur - Local Farmers Marketplace"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		site: "@farmpreneur",
		creator: "@farmpreneur"
	},

	alternates: {
		canonical: baseUrl,
		languages: {
			"en-US": baseUrl,
			"es-ES": `${baseUrl}/es`
		}
	}
}
export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<meta name="apple-mobile-web-app-title" content="Farmpreneur" />
			<body className={inter.className}>
				<NuqsAdapter>
					<Providers>{children}</Providers>
					<Toaster richColors className={inter.className} />
				</NuqsAdapter>
				{/* <LoadTimeTracker /> */}
			</body>
		</html>
	)
}
