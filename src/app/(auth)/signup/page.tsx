import { Metadata } from "next"
import Link from "next/link"

import GoogleButton from "@/app/_components/google-button"
import RegisterForm from "./_components/register-form"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AuthLeftSection } from "../_components/auth-left-section"
import { AuthRightSection } from "../_components/auth-right-section"

export const metadata: Metadata = {
	title: "Sign up",
	description:
		"Sign up for an account to access exclusive features and content."
}

export default async function SignupPage() {
	return (
		<>
			<AuthLeftSection>
				<Card className="lg:border-0 lg:shadow-none">
					<CardHeader>
						<CardTitle>Sign Up</CardTitle>
						<CardDescription>
							Enter your information to create an account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="">
							<GoogleButton />
							<div className="relative my-4">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or
									</span>
								</div>
							</div>
						</div>
						<RegisterForm />
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
				imageProps={{ src: "/auth2.svg", alt: "Sign up image" }}
			/>
		</>
	)
}
