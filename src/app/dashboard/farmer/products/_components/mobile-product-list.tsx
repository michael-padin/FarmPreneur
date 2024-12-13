import { OrderStatusBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { UnitKey, UNITS_MAP } from "@/constants/unit"
import { getProductsUseCase } from "@/use-cases/products"
import { Box, Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { searchParamsCache } from "./searchParams"

export async function FarmerProductList() {
	const { status, search } = searchParamsCache.all()
	const products = await getProductsUseCase({
		status,
		search
	})

	return (
		<div className="space-y-2">
			{products && products.length > 0 ? (
				products?.map((product) => (
					<Card key={product.id} className="border-none">
						<CardHeader className="p-2">
							<div className="flex items-start gap-4">
								<Image
									src={product.images[0]?.url || "/placeholder.svg"}
									alt={product.title}
									height={96}
									width={96}
									priority
									quality={75}
									className="aspect-square rounded-lg object-cover"
								/>
								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-2">
										<h2 className="truncate font-semibold">{product.title}</h2>
										<div className="flex items-center">
											<OrderStatusBadge
												status={product.listingStatus}
												showText
											/>
										</div>
									</div>

									<p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
										{product.description}
									</p>
								</div>
							</div>
						</CardHeader>
						<CardFooter className="flex items-center justify-between pt-2">
							<div className="grid flex-1 grid-cols-2 gap-2 text-sm">
								<div>
									<p className="text-muted-foreground">Price</p>
									<p className="font-medium">
										₱{product.price.toFixed(2)}/
										{UNITS_MAP[(product.unit || "kg") as UnitKey].abbreviation}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Stock</p>
									<p className="font-medium">
										{product.quantity}{" "}
										{UNITS_MAP[(product.unit || "kg") as UnitKey].abbreviation}
									</p>
								</div>
							</div>
							<Button variant={"outline"} size={"icon"} className="">
								<Link href={`/dashboard/farmer/products/${product.id}/edit`}>
									<Edit />
									<span className="sr-only">Edit</span>
								</Link>
							</Button>
						</CardFooter>
					</Card>
				))
			) : (
				<div className="pt-20">
					<div className="flex h-full flex-col items-center justify-center text-muted-foreground">
						<div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-background">
							<Box className="h-8 w-8 text-primary" />
						</div>
						<p className="text-sm">No products found</p>
					</div>
				</div>
			)}
		</div>
	)
}
