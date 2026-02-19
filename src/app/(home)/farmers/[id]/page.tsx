import BottomNav from "../../_components/bottom-nav"
import { FarmerProducts } from "./_components/farmer-products"
import { NavWrapper } from "./_components/nav-wrapper"
import { FarmerProfile } from "./_components/profile-header"

//export const experimental_ppr = true

type Params = Promise<{ id: string }>

export default function FarmerProductsPage({ params }: { params: Params }) {
	return (
		<div className="h-screen overflow-auto bg-muted pb-[84.5px]">
			<header className="">
				<NavWrapper />
			</header>
			<main className="bg-muted lg:container">
				<div className="pt-16">
					<div className="space-y-2 rounded-lg">
						<div className="">
							<FarmerProfile params={params} />
						</div>
						<div className="mt-2 w-full space-y-2 px-2">
							<h1 className="text-2xl font-bold">Products</h1>
							<div className="space-y-3 rounded-lg">
								<FarmerProducts params={params} />
							</div>
						</div>
					</div>
				</div>
			</main>
			<BottomNav />
		</div>
	)
}
