import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import RegisterFarmerForm from "./_components/register-farmer-form"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AuthLeftSection } from "../_components/auth-left-section"
import { AuthRightSection } from "../_components/auth-right-section"

export const metadata: Metadata = {
	title: "Register Farmer - FarmPreneur",
	description: " "
}

const RegisterFarmerPage = async () => {
	return (
		<>
			<AuthLeftSection>
				<Card className="lg:border-0 lg:shadow-none">
					<CardHeader>
						<CardTitle>Create Farmer Account</CardTitle>
						<CardDescription>
							Enter your information to create your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<RegisterFarmerForm />
						<Link
							href="/login"
							className={cn(
								buttonVariants({ variant: "secondary" }),
								"mt-2 w-full text-sm"
							)}
						>
							Already have an account?
						</Link>
					</CardContent>
				</Card>
			</AuthLeftSection>
			<AuthRightSection
				imageProps={{ src: "/auth2.svg", alt: "Register farmer image" }}
			/>
		</>
	)
}
export default RegisterFarmerPage
