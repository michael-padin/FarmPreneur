import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { FarmerApplicationStatus } from "./farmer-application-status"

const getApplicationStatus = async () => {
	const session = await auth()
	if (!session || !session.user) redirect("/login")

	const applicationStatus = await db.farmer.findFirst({
		where: {
			id: session.user.farmerId
		},
		select: {
			applicationStatus: true,
			applicationRejection: true
		}
	})

	if (!applicationStatus) redirect("/login")

	return applicationStatus
}

export async function FarmerApplicationStatusWrapper() {
	const applicationStatus = await getApplicationStatus()
	return (
		<FarmerApplicationStatus
			status={applicationStatus.applicationStatus!}
			rejectionReason={applicationStatus?.applicationRejection || ""}
		/>
	)
}
