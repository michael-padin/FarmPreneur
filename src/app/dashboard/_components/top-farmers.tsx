import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { abbreviateNumber } from "@/lib/utils"
import { getTopFarmersUseCase } from "@/use-cases/farmers"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"

export async function TopFarmers() {
	const farmers = await getTopFarmersUseCase()
	return (
		<div className="">
			{farmers?.length ? (
				farmers.map((farm, index) => (
					<Fragment key={farm.id}>
						<div className="gap-4">
							<div className="flex items-start gap-2">
								<div className="relative h-14 w-14 flex-shrink-0 lg:h-20 lg:w-20">
									<Image
										src={farm.profilePicture || "/placeholder.svg"}
										alt={farm.name || "farmer"}
										className="rounded-full"
										fill
										style={{ objectFit: "cover" }}
									/>
									<Badge
										className={`absolute -left-2 -top-2 z-10 ${
											index + 1 === 1
												? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
												: "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground"
										}`}
									>
										TOP {index + 1}
									</Badge>
								</div>
								<div className="flex-1">
									<h2 className="text:sm break-words font-semibold lg:text-xl">
										{farm.name}
									</h2>
									<p className="inline-flex items-center gap-0.5 text-xs text-muted-foreground lg:text-base">
										<MapPin className="h-4 w-4" />
										{farm.address}
									</p>
								</div>
								<div>
									<Button
										className="hidden lg:flex"
										variant={"outline"}
										asChild
									>
										<Link href={`/dashboard/farmer/farmer-details/${farm.id}`}>
											Visit Farm
										</Link>
									</Button>
								</div>
							</div>

							<div className="mx-auto">
								<div className="mt-2 flex w-full flex-wrap gap-6">
									<div className="text-center">
										<div className="font-semibold text-primary">
											{farm.averageRating}
										</div>
										<div className="text-xs text-muted-foreground lg:text-sm">
											Rating
										</div>
									</div>
									<div className="text-center">
										<div className="font-semibold text-primary">
											{abbreviateNumber(farm.numberOfProducts)}
										</div>
										<div className="text-xs text-muted-foreground lg:text-sm">
											Products
										</div>
									</div>
									<div className="text-center">
										<div className="font-semibold text-primary">
											{farm.responseRate}
										</div>
										<div className="text-xs text-muted-foreground lg:text-sm">
											Response
										</div>
									</div>
									<div className="text-center">
										<div className="font-semibold text-primary">
											{abbreviateNumber(farm.totalSales)}
										</div>
										<div className="text-xs text-muted-foreground lg:text-sm">
											Sales
										</div>
									</div>
								</div>
							</div>
						</div>
						{farmers.length - 1 !== index && <Separator className="my-4" />}
					</Fragment>
				))
			) : (
				<p className="my-10 text-center">No farmers found</p>
			)}
		</div>
	)
}
