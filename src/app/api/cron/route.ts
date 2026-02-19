import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

const isAuthorizedCronRequest = (request: Request) => {
	const cronSecret = process.env.CRON_SECRET

	if (!cronSecret) {
		return process.env.NODE_ENV === "development"
	}

	const authHeader = request.headers.get("authorization")
	return authHeader === `Bearer ${cronSecret}`
}

export async function GET(request: Request) {
	if (!isAuthorizedCronRequest(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	// Calculate the cutoff time (24 hours ago)
	const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000)

	const foundOrders = await db.order.findMany({
		where: {
			status: "COMPLETED",
			subStatus: "PICKED_UP_BY_BUYER",
			updatedAt: {
				lt: cutoffTime
			}
		}
	})

	if (foundOrders.length === 0) return NextResponse.json({ ok: true })

	const updatedOrders = await Promise.all(
		foundOrders.map((order) =>
			db.order.update({
				where: { id: order.id },
				data: { status: "COMPLETED", subStatus: "BUYER_CONFIRMED_ORDER" }
			})
		)
	)

	console.log("updatedOrders", updatedOrders)

	// Revalidate any cached pages that show order status
	revalidatePath("/orders")
	revalidatePath("/dashboard")

	return NextResponse.json({
		message: "Orders updated successfully"
	})
}
