import { auth } from "@/auth"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getUserFarmerByIdUseCase } from "@/use-cases/users"
import { CheckCircle, Clock, Loader2 } from "lucide-react"
import { redirect } from "next/navigation"
import { AuthLeftSection } from "../_components/auth-left-section"
import { AuthRightSection } from "../_components/auth-right-section"
import { BackButtonLogout } from "@/components/fg/back-button"

export default async function AdminApprovalPage() {
	const session = await auth()

	if (!session) redirect("/login")

	const farmer = await getUserFarmerByIdUseCase(session!.user.id!)

	if (farmer?.farmerApplicationStatus === "APPROVED")
		redirect("/setup-farm-information")

	return (
		<>
			<AuthLeftSection>
				<div>
					<BackButtonLogout />
					<Card className="w-full max-w-md overflow-hidden">
						<CardHeader className="relative z-10 pb-0 text-center">
							<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
								<Clock className="h-12 w-12 animate-pulse text-primary" />
							</div>
							<CardTitle className="text-3xl font-bold text-foreground">
								Waiting for Approval
							</CardTitle>
							<CardDescription className="text-primary/80">
								Your account is pending for review
							</CardDescription>
						</CardHeader>
						<CardContent className="relative z-10 space-y-6 pt-6">
							<p className="text-center text-muted-foreground">
								Thank you for registering! Our team will review your application
								shortly. We&apos;ll notify you once your account has been
								approved.
							</p>
							<div className="space-y-2">
								<div className="flex items-center space-x-2 text-sm text-muted-foreground">
									<CheckCircle className="h-5 w-5 text-primary" />
									<span>Registration complete</span>
								</div>
								<div className="flex items-center space-x-2 text-sm text-muted-foreground">
									<Loader2 className="h-5 w-5 animate-spin text-primary" />
									<span>Awaiting admin approval</span>
								</div>
							</div>
							<div className="h-2.5 w-full rounded-full bg-primary/20">
								<div className="h-2.5 w-1/2 animate-pulse rounded-full bg-primary"></div>
							</div>
						</CardContent>
						<CardFooter className="relative z-10 flex flex-col space-y-4">
							<p className="text-center text-xs text-muted-foreground">
								Expected approval time: 1-2 business days
							</p>
						</CardFooter>
					</Card>
				</div>
			</AuthLeftSection>
			<AuthRightSection
				imageProps={{ src: "/auth2.svg", alt: "farmer approval image " }}
			/>
		</>
	)
}
