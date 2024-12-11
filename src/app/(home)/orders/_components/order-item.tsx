import { formatPHP } from "@/lib/utils"
import { getCustomerOrdersUseCase } from "@/use-cases/orders"
import Image from "next/image"

export function OrderItem({
	item
}: {
	item: Awaited<ReturnType<typeof getCustomerOrdersUseCase>>[0]["items"][0]
}) {
	return (
		<>
			<div className="">
				<div key={item.id} className="flex gap-4">
					<div className="relative h-24 w-24 overflow-hidden rounded-lg border">
						<Image
							src={item.product.images[0].url}
							alt={item.product.title}
							fill
							className="object-cover"
							priority
							sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
						/>
					</div>
					<div className="flex flex-1 flex-col gap-1">
						<div className="flex items-center justify-between">
							<h3 className="font-medium">{item.product.title}</h3>
						</div>
						<div className="mt-auto flex items-center justify-between">
							<div className="flex items-center gap-2">
								<p className="text-primary">
									₱{formatPHP(item.product.price)}/
									<span className="">{item.product.unit}</span>
								</p>
							</div>
							<div className="">
								<span className="">x{item.quantity}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
