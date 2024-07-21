import {
	Categories,
	DailyDiscovery,
	DesktopNav,
	Features,
	MobileNav
} from "./_components"

const Home = async () => {
	return (
		<>
			<header>
				<MobileNav />
				<DesktopNav />
			</header>
			<main className="bg-secondary pb-12">
				<section className="m-auto w-full">
					{/* <div className="absolute  inset-0  bg-black/20 backdrop-blur-sm"></div> */}
					<div className="container relative mx-auto h-full px-0 lg:px-4 lg:pt-[101px]">
						<div className="flex items-center justify-center bg-primary pb-20 pt-28 lg:rounded-lg lg:py-20">
							{/* <Vegan
								className="absolute -bottom-5 left-10 h-32 w-32 stroke-white"
								strokeWidth={1}
							/>
							<Carrot
								className="absolute -bottom-5 right-10 h-32 w-32 stroke-white"
								strokeWidth={1}
							/>
							<Banana
								className="absolute -bottom-5 right-60 h-32 w-32 stroke-white"
								strokeWidth={1}
							/>
							<Apple
								className="absolute -bottom-5 left-60 h-32 w-32 stroke-white"
								strokeWidth={1}
							/> */}

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
				<Categories />
				<Features />
				<DailyDiscovery />
			</main>
			{/* <Footer /> */}
		</>
	)
}

export default Home
