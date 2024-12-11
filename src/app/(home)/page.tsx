import { BottomNav, Categories } from "./_components"
import { DailyDiscovery } from "./_components/daily-discovery"
import { Features } from "./_components/features"
import { HomeNav } from "./_components/home-nav"

export const experimental_ppr = true

export default function Home() {
	return (
		<div>
			<main className="bg-secondary pb-16">
				<header>
					<HomeNav />
					<section className="m-auto w-full">
						{/* <div className="absolute  inset-0  bg-black/20 backdrop-blur-sm"></div> */}
						<div className="container relative mx-auto h-full px-0 lg:px-4 lg:pt-[101px]">
							<div className="flex items-center justify-center bg-primary pb-20 pt-28 lg:rounded-lg lg:py-20">
								<div className="relative space-y-5 text-center text-white lg:space-y-10">
									<h1 className="text-3xl font-bold leading-normal tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
										Discover the Best Local Produce
									</h1>
									<p className="mx-auto max-w-[700px] lg:text-xl">
										Connect directly with farmers and get the freshest,
										highest-quality produce delivered to your door.
									</p>
								</div>
							</div>
						</div>
					</section>
				</header>
				<div className="mx-2">
					<Categories />
					<Features />
					<DailyDiscovery />
					<BottomNav />
				</div>
			</main>
		</div>
	)
}
