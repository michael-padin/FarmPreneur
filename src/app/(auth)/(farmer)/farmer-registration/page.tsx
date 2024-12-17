import { auth } from "@/auth"
import { BackButtonLogout } from "@/components/fg/back-button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { redirect } from "next/navigation"
import { AuthLeftSection } from "../../_components/auth-left-section"
import { AuthRightSection } from "../../_components/auth-right-section"
import { FarmRegistrationForm } from "./_components/farmer-registration-form"

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
							<CardTitle>Provide Farm Information</CardTitle>
							<CardDescription>
								<span className="text-lg text-destructive">* </span>
								Please ensure that all information provided is accurate and
								complete. This information will be used to verify your identity
								and eligibility as a farmer. Inaccurate or incomplete
								submissions may result in delays or rejection of your
								application
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
