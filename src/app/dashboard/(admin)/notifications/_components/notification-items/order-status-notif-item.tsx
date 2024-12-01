import Image from "next/image"

export const OrderStatusNotificationItem = ({
	title,
	message,
	metadata
}: {
	title: string
	message: string
	metadata: Record<string, string | undefined | null>
}) => {
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
					<p className="text-sm font-medium">Order Status</p>
				</div>
				<p className="text-sm text-muted-foreground">{message}</p>
				<p className="text-xs text-muted-foreground">
					{metadata.orderId ? `Order ID: ${metadata.orderId}` : "Order ID: N/A"}
				</p>
			</div>
		</div>
	)
}
