import { NuqsAdapter } from "nuqs/adapters/next/app"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import "./globals.css"

import { Toaster } from "@/components/ui/sonner"
import { ensureStartsWith } from "@/lib/utils"
import { Poppins } from "next/font/google"
import { Providers } from "./providers"

const inter = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"]
})

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
	? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
	: "http://localhost:3000"

const twitterCreator = TWITTER_CREATOR
	? ensureStartsWith(TWITTER_CREATOR, "@")
	: undefined
const twitterSite = TWITTER_SITE
	? ensureStartsWith(TWITTER_SITE, "https://")
	: undefined

export const metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: SITE_NAME!,
		template: `%s | ${SITE_NAME}`
	},
	robots: {
		follow: true,
		index: true
	},
	...(twitterCreator &&
		twitterSite && {
			twitter: {
				card: "summary_large_image",
				creator: twitterCreator,
				site: twitterSite
			}
		})
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
