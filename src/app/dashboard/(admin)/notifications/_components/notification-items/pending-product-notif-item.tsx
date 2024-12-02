import Image from "next/image"

export function ProductApprovalNotificationItem({
	title,
	message,
	metadata
}: {
	title: string
	message: string
	metadata: Record<string, string | undefined | null>
}) {
	return (
		<div className="flex items-start gap-4 py-2">
			<div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
				<Image
					src={metadata.productImage || "/placeholder.svg"}
					alt={title}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex-1 space-y-1">
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium">Product Approval</p>
				</div>
				<p className="text-sm text-muted-foreground">{message}</p>
				<p className="text-xs text-muted-foreground">
					{metadata.productId
						? `Product ID: ${metadata.productId}`
						: "Product ID: N/A"}
				</p>
				<p className="text-xs text-muted-foreground">
					{metadata.productName
						? `Product Name: ${metadata.productName}`
						: "Product Name: N/A"}
				</p>
				<p className="text-xs text-muted-foreground">
					{metadata.farmerId
						? `Farmer ID: ${metadata.farmerId}`
						: "Farmer ID: N/A"}
				</p>
				<p className="text-xs text-muted-foreground">
					{metadata.farmerName
						? `Farmer Name: ${metadata.farmerName}`
						: "Farmer Name: N/A"}
				</p>
			</div>
		</div>
	)
}
