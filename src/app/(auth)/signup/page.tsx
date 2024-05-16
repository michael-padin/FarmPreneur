import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import SignUpFormTabs from "./_components/form-tabs"

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Sign up for an account to access exclusive features and content.",
}

export default async function SignupPage() {
  return (
    <div className="h-screen w-full overflow-hidden lg:grid lg:grid-cols-2 xl:min-h-screen">
      <div className="relative hidden h-full flex-col bg-muted p-10  dark:border-r lg:flex">
        <div className="absolute inset-0 ">
          <Image src="/login.svg" alt="login image" objectFit="contain" fill />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <h1 className="text-2xl font-black">
            <Link href={"/"}>
              <span className="text-primary">Share</span>Surplus
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
      <ScrollArea className="h-screen">
        <div className="flex items-center justify-center p-4 py-12">
          <div className="mx-auto grid gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="text-balance text-muted-foreground">
                Enter your information to create an account
              </p>
            </div>
            <SignUpFormTabs />
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
    </div>
  )
}
