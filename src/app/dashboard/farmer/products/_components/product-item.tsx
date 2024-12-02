import Image from "next/image"
import { MoreVertical, Eye, Pencil, Trash2, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { ProductListingStatusBadge } from "@/app/dashboard/(admin)/users/(lists)/_components/badges"
import { UnitKey, UNITS_MAP } from "@/constants/unit"
import { getProductsUseCase } from "@/use-cases/products"

interface ProductItemProps {
	product: Awaited<ReturnType<typeof getProductsUseCase>>[0]
}

export function ProductItem({ product }: ProductItemProps) {
	return (
		<Card key={product.id} className="">
			<CardHeader className="p-4 pb-2">
				<div className="flex items-start gap-4">
					<Image
						src={product.images[0]?.url || "/placeholder.svg"}
						alt={product.title}
						className="w-auto rounded-lg"
						priority
						height={96}
						width={96}
					/>
					<div className="min-w-0 flex-1">
						<div className="flex items-center justify-between gap-2">
							<h2 className="truncate font-semibold">{product.title}</h2>
						</div>
						<p className="line-clamp-2 text-sm text-muted-foreground">
							{product.description}
						</p>
						<div className="mt-2 flex w-full items-start justify-end">
							<ProductListingStatusBadge
								status={product.listingStatus}
								showText
							/>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-4 pb-2 pt-2">
				<div className="grid grid-cols-2 gap-2 text-sm">
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
			</CardContent>
			<CardFooter className="flex items-center justify-between p-4 pt-2">
				<div className="text-xs text-muted-foreground">
					<p>Created: {formatDate(product.createdAt)}</p>
					<p>Updated: {formatDate(product.createdAt)}</p>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm">
							<MoreVertical className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[160px]">
						<DropdownMenuItem>
							<Eye className="mr-2 h-4 w-4" />
							Preview
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardFooter>
		</Card>
	)
}
