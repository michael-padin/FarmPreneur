import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import GoogleButton from "@/app/_components/google-button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import SignUpFormTabs from "./_components/form-tabs"
import RegisterForm from "./_components/register-form"

export const metadata: Metadata = {
	title: "Sign up",
	description:
		"Sign up for an account to access exclusive features and content."
}

export default async function SignupPage() {
	return (
		<div className="h-screen w-full overflow-hidden lg:grid lg:grid-cols-2 xl:min-h-screen">
			<ScrollArea className="h-screen">
				<div className="flex items-center justify-center p-4">
					<div className="mx-auto grid gap-6">
						<div className="grid gap-2 text-center">
							<Link
								className="flex items-center justify-center gap-2 text-3xl font-black text-[#404145] lg:hidden"
								href="/"
							>
								<img src="/logo.svg" alt="" className="h-[100px] w-[100px]" />
							</Link>
							<h1 className="text-3xl font-bold">Sign Up</h1>
							<p className="text-balance text-muted-foreground">
								Enter your information to create an account
							</p>
						</div>
						{/* <SignUpFormTabs /> */}
						<div className="grid gap-6">
							<RegisterForm />
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<GoogleButton />
						</div>

						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<Link href="/login" className="underline">
								Log in
							</Link>
						</div>
						<p className="px-8 text-center text-sm text-muted-foreground">
							By clicking continue, you agree to our{" "}
							<Link
								href="/terms"
								className="underline underline-offset-4 hover:text-primary"
							>
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link
								href="/privacy"
								className="underline underline-offset-4 hover:text-primary"
							>
								Privacy Policy
							</Link>
							.
						</p>
					</div>
				</div>
				<ScrollBar />
			</ScrollArea>
			<div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
				<div className="absolute inset-0">
					<Image
						src="/placeholder.svg"
						alt="login image"
						objectFit="cover"
						fill
					/>
				</div>
				<div className="relative z-20 flex items-center text-lg font-medium">
					<h1 className="text-2xl font-black text-primary">
						<Link href="/">
							Farm2go
							{/* <Link href={"/"} className="flex items-center gap-2">
              <Image
                src="./logo.svg"
                alt="Farm2go logo"
                width={50}
                height={50}
              />
            </Link> */}
						</Link>
					</h1>
				</div>
				{/* <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div> */}
			</div>
		</div>
	)
}
