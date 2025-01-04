"use client"
import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip"
import { getPendingProductsUseCase } from "@/use-cases/products"
import { AlertCircle, CheckCircle, Eye, XCircle } from "lucide-react"
import Image from "next/image"
import { use } from "react"

interface PendingProductsProps {
	pendingProductsPromise: Promise<
		Awaited<ReturnType<typeof getPendingProductsUseCase>>
	>
}
export function PendingProducts({
	pendingProductsPromise
}: PendingProductsProps) {
	const pendingProducts = use(pendingProductsPromise)
	return (
		<>
			<ul className="space-y-4">
				{pendingProducts.map((product) => (
					<li
						key={product.id}
						className="flex items-center justify-between space-x-4 rounded-lg bg-transparent p-4 transition-all hover:shadow-md"
					>
						<div className="flex items-center space-x-4">
							<div className="relative aspect-square h-12">
								<Image
									src={product.productImages[0]}
									alt={product.title}
									fill
									className="h-full w-full object-cover"
								/>
							</div>
							<div className="space-y-1.2">
								<p className="text-sm font-medium leading-none">
									{product.title}
								</p>
								<p className="text-xs text-muted-foreground">
									<span>by </span>
									{product.farmer?.user.name}
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button size="icon" variant="ghost">
											<Eye className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>View Details</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="text-green-600 hover:bg-green-100 hover:text-green-700"
											onClick={() => {}}
										>
											<CheckCircle className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Approve Product</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="text-red-600 hover:bg-red-100 hover:text-red-700"
											onClick={() => {}}
										>
											<XCircle className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Reject Product</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</li>
				))}
			</ul>
			{pendingProducts.length === 0 && (
				<div className="py-8 text-center text-muted-foreground">
					<AlertCircle className="mx-auto mb-4 h-12 w-12" />
					<p>No pending products to approve</p>
				</div>
			)}
		</>
	)
}
