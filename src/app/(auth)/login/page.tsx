import { Metadata } from "next"
import Link from "next/link"

import GoogleButton from "@/app/_components/google-button"
import { buttonVariants } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AuthLeftSection } from "../_components/auth-left-section"
import { AuthRightSection } from "../_components/auth-right-section"
import { DemoAccounts } from "./_components/demo-accounts"
import LoginForm from "./_components/login-form"

export const metadata: Metadata = {
	title: "Log in",
	description:
		"Log in to your account to access exclusive features and content."
}

export default async function LoginPage() {
	return (
		<>
			<AuthLeftSection>
				<Card className="lg:border-0 lg:shadow-none">
					<CardHeader>
						<CardTitle>Log In</CardTitle>
						<CardDescription>
							Enter your email and password to log in
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
						<LoginForm />
						<DemoAccounts />
					</CardContent>
					<CardFooter>
						<div className="mx-auto w-full text-center">
							<p className="relative mb-2 text-xs text-primary">
								Don&apos;t have an account?{" "}
							</p>
							<div className="mx-auto w-full space-y-2">
								<Link
									href="/signup"
									className={cn(
										buttonVariants({ variant: "secondary" }),
										"w-full"
									)}
								>
									Create new account
								</Link>
								<Link
									href="/register-farmer"
									className={cn(
										buttonVariants({ variant: "secondary" }),
										"w-full"
									)}
								>
									Create new farmer account
								</Link>
							</div>
						</div>
					</CardFooter>
				</Card>
			</AuthLeftSection>
			<AuthRightSection
				imageProps={{ src: "/auth2.svg", alt: "Log in image" }}
			/>
		</>
	)
}
