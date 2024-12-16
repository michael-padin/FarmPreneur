import { NuqsAdapter } from "nuqs/adapters/next/app"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import "./globals.css"

import { Toaster } from "@/components/ui/sonner"
import { Poppins } from "next/font/google"
import { Providers } from "./providers"

const inter = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"]
})

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
