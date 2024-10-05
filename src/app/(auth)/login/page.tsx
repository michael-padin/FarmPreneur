import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import GoogleButton from "@/app/_components/google-button"
import { ResendSignIn } from "@/app/_components/resend-signin"
import LoginForm from "./_components/login-form"

export const metadata: Metadata = {
	title: "Log in",
	description:
		"Log in to your account to access exclusive features and content."
}

export default async function LoginPage() {
	return (
		<div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
			<div className="mx-auto flex items-center justify-center p-4">
				<div className="mx-auto grid gap-6 md:w-[400px]">
					<Link
						className="flex items-center justify-center gap-2 text-3xl font-black text-[#404145] lg:hidden"
						href="/"
					>
						<h1 className="text-primary">FarmPreneur</h1>
						<img
							src="/logo.svg"
							alt=""
							className="sr-only h-[100px] w-[100px] lg:not-sr-only"
						/>
					</Link>
					<div className="space-y-2">
						<h1 className="text-center text-3xl font-bold">Login</h1>
						<p className="text-balance text-center text-muted-foreground">
							Enter your credentials below to login to your account
						</p>
					</div>
					<div className="grid gap-6">
						<GoogleButton />
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or
								</span>
							</div>
						</div>
						<LoginForm />
					</div>
					{/* <ResendSignIn /> */}
					<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/signup" className="underline">
							Sign up
						</Link>
					</div>
				</div>
			</div>
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
						<Link href="/">Farm2go</Link>
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
