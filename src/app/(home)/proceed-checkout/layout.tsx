import { Poppins } from "next/font/google"

const inter = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"]
})
const ProceedCheckoutLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	)
}

export default ProceedCheckoutLayout
