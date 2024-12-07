/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XQyO7EHnAuO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UnitKey, UNITS_MAP } from "@/constants/unit"
import { formatPHP } from "@/lib/utils"
import { getProductBySlugUseCase } from "@/use-cases/products"
import { MinusIcon, PlusIcon, Star } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import ProductBottomNav from "./_components/bottom-nav"
import { Farmer } from "./_components/farmer"
import { Gallery } from "./_components/gallery"
import { TopNav } from "./_components/top-nav"

type Params = Promise<{ slug: string }>

export default async function Page(props: { params: Params }) {
	const params = await props.params
	const slug = params.slug

	if (!slug) {
		notFound()
	}
	const product = await getProductBySlugUseCase(slug)

	if (!product) {
		notFound()
	}

	return (
		<main className="relative bg-muted">
			<TopNav />
			<div className="space-y-4 pb-20">
				<div className="lg:gap-12b grid items-start lg:container md:grid-cols-2 lg:mx-auto lg:px-4">
					<div className="grid gap-4">
						<div className="bg-background">
							<Suspense
								fallback={
									<div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
								}
							>
								<Gallery
									images={product.images.slice(0, 5).map((image) => ({
										src: image.url!,
										altText: image.altText || ""
									}))}
								/>
							</Suspense>
						</div>
					</div>
					<div className="grid bg-background p-3">
						<div className="flex items-center justify-between gap-4">
							<div className="text-2xl font-semibold text-primary">
								<span className="text-xs">₱</span>
								{formatPHP(product?.price || 0)}/
								{UNITS_MAP[product.unit as UnitKey].abbreviation}
							</div>
							<div className="mb-1 flex items-center gap-2">
								<div className="flex items-center">
									<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
									<span className="ml-1 text-sm font-medium">
										{product.averageRating}
									</span>
								</div>
								<Separator orientation="vertical" className="h-4 w-px" />
								<span className="text-sm text-muted-foreground">
									{product._count.orders} Sold
								</span>
							</div>
							{/* <Badge variant={"outline"}>{product.category?.name}</Badge> */}
						</div>
						<div className="grid">
							<h1 className="text-2xl font-semibold capitalize">
								{product.title}
							</h1>
							<Separator className="my-2" />
							<div className="space-y-4">
								<div className="">
									<Label className="text-base" htmlFor="description">
										Description
									</Label>
									<p className="text-muted-foreground" id="description">
										{product.description}
									</p>
								</div>
								<div className="">
									<Label className="text-base" htmlFor="stock">
										Stock
									</Label>
									<p className="text-muted-foreground" id="stock">
										{product.quantity}{" "}
										{UNITS_MAP[product.unit as UnitKey].abbreviation}
									</p>
								</div>
								<div className="flex items-center gap-4">
									<Label className="text-base" htmlFor="quantity">
										Quantity
									</Label>
									<div className="flex items-center gap-2">
										<div className="flex w-[100px] items-center justify-between gap-2 rounded-full bg-muted px-3 py-1">
											<Button
												className="h-4 w-4 text-gray-500 hover:bg-transparent dark:text-gray-400"
												size="icon"
												variant="ghost"
											>
												<MinusIcon className="h-4 w-4" />
												<span className="sr-only">Decrease quantity</span>
											</Button>
											<span className="text-base font-medium">1</span>
											<Button
												className="h-4 w-4 text-gray-500 hover:bg-transparent dark:text-gray-400"
												size="icon"
												variant="ghost"
											>
												<PlusIcon className="h-4 w-4" />
												<span className="sr-only">Increase quantity</span>
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-background p-4">
					<Farmer farmerId={product.farmer!.id} />
				</div>
			</div>
			<ProductBottomNav />
		</main>
	)
}
