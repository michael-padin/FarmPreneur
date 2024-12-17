import { Button } from "@/components/ui/button"
import { abbreviateNumber } from "@/lib/utils"
import { getFarmerInfoInProductDetailsUseCase } from "@/use-cases/farmers"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface FarmerProps {
	farmerId: string
}
export async function Farmer({ farmerId }: FarmerProps) {
	const farmer = await getFarmerInfoInProductDetailsUseCase(farmerId)
	return (
		<div className="gap-4">
			<div className="">
				<div className="flex items-start gap-2">
					<div className="relative h-14 w-14 flex-shrink-0 lg:h-20 lg:w-20">
						<Image
							src={farmer.profilePicture || "/placeholder.svg"}
							alt={`${farmer.name}'s profile picture`}
							className="rounded-full"
							fill
							style={{ objectFit: "cover" }}
						/>
					</div>
					<div className="flex-1">
						<h2 className="break-words font-semibold capitalize lg:text-xl">
							{farmer.name}
						</h2>
						<p className="inline-flex items-center gap-0.5 text-sm text-muted-foreground lg:text-base">
							<MapPin className="h-4 w-4" />
							<span className="truncate">{farmer.address}</span>
						</p>
					</div>
				</div>
			</div>

			<div className="mx-auto">
				<div className="mt-2 flex h-full items-center justify-between">
					<div className="flex w-full flex-wrap gap-6">
						<div className="text-center">
							<div className="font-semibold text-primary">
								{farmer.averageRating}
							</div>
							<div className="text-sm text-muted-foreground lg:text-sm">
								Rating
							</div>
						</div>
						<div className="text-center">
							<div className="font-semibold text-primary">
								{abbreviateNumber(farmer.numberOfProducts)}
							</div>
							<div className="text-sm text-muted-foreground lg:text-sm">
								Products
							</div>
						</div>
						<div className="text-center">
							<div className="font-semibold text-primary">
								{farmer.responseRate}
							</div>
							<div className="text-sm text-muted-foreground lg:text-sm">
								Response
							</div>
						</div>
					</div>
					<div className="flex h-full items-end">
						<Button className="" variant={"outline"} size={"sm"} asChild>
							{/* <Button className="" variant={"outline"} asChild size={"sm"}> */}
							<Link href={`/farmers/${farmer.id}`}>Visit</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
