import { redirect } from "next/navigation"
import { FarmRegistrationForm } from "./_components/farmer-registration-form"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { AuthLeftSection } from "../../_components/auth-left-section"
import { AuthRightSection } from "../../_components/auth-right-section"
import { auth } from "@/auth"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { BackButtonLogout } from "@/components/fg/back-button"

export default async function Page() {
	const session = await auth()

	if (!session || !session.user) {
		redirect("/login")
	}

	const user = await getUserFarmerByIdUseCase(session.user.id)

	if (!user) redirect("/login")

	if (user.farmer?.applicationStatus === "APPROVED")
		redirect("/dashboard/farmer")
	if (user.farmer?.applicationStatus === "PENDING") redirect("/admin-approval")

	return (
		<>
			<AuthLeftSection>
				<div className="space-y-2">
					<BackButtonLogout />
					<Card className="lg:border-0 lg:shadow-none">
						<CardHeader>
							<CardTitle>Setup Farm Information</CardTitle>
							<CardDescription>
								Setup your farm information and start selling now!
							</CardDescription>
						</CardHeader>
						<CardContent>
							<FarmRegistrationForm user={user} />
						</CardContent>
					</Card>
				</div>
			</AuthLeftSection>
			<AuthRightSection
				imageProps={{ src: "/auth2.svg", alt: "Setup Farm Information" }}
			/>
		</>
	)
}
