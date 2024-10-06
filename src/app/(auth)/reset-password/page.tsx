import Link from "next/link"
import Image from "next/image"
import NewPasswordForm from "./_components/new-password-form"
import { redirect } from "next/navigation"

export default async function ResetPasswordPage({
	searchParams
}: {
	searchParams?: { [key: string]: string | string[] | undefined }
}) {
	if (!searchParams?.token) {
		return redirect("/login")
	}
	return (
		<div className="h-screen w-full lg:grid lg:grid-cols-2 lg:overflow-hidden xl:min-h-screen">
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
						<h1 className="text-center text-3xl font-bold">
							Create New Password
						</h1>
						<p className="text-balance text-center text-muted-foreground">
							Enter your new password below.
						</p>
					</div>

					<div className="grid gap-6">
						<NewPasswordForm token={searchParams?.token as string} />
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
			</div>
		</div>
	)
}
