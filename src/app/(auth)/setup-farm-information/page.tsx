import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CompleteFarmerDetailsForm } from "./_components/farm-information-form"
import { getFarmDetailsByUserIdUseCase } from "@/use-cases/farm-details"
import { getVerificationDocumentByUserIdUseCase } from "@/use-cases/verification-document"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getUserFarmerById } from "@/data-access/users"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AuthLeftSection } from "../_components/auth-left-section"
import { AuthRightSection } from "../_components/auth-right-section"

export default async function Page() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	const farmDetails = await getFarmDetailsByUserIdUseCase(session!.user.id!)
	const farmer = await getUserFarmerById(session!.user.id!)

	if (farmDetails && farmer?.farmerApplicationStatus === "APPROVED")
		redirect("/dashboard/farmer")

	if (farmer?.farmerApplicationStatus === "PENDING") redirect("/admin-approval")

	return (
		<>
			<AuthLeftSection>
				<Card className="lg:border-0 lg:shadow-none">
					<CardHeader>
						<CardTitle>Setup Farm Information</CardTitle>
						<CardDescription>
							Setup your farm information and start selling now!
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CompleteFarmerDetailsForm
							farmDetails={farmDetails}
							farmerEmail={session?.user.email || ""}
							farmerId={session?.user.id || ""}
						/>
					</CardContent>
				</Card>
			</AuthLeftSection>
			<AuthRightSection
				imageProps={{ src: "/auth2.svg", alt: "Setup Farm Information" }}
			/>
		</>
	)
}
