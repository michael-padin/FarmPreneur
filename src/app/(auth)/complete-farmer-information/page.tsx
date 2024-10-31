import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CompleteFarmerDetailsForm } from "./_components/farmer-details-form"
import { getFarmDetailsByUserIdUseCase } from "@/use-cases/farm-details"
import { getVerificationDocumentByUserIdUseCase } from "@/use-cases/verification-document"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"

export default async function CompleteFarmerInformationPage() {
	const session = await auth()

	// if (!session) {
	// 	redirect("/login")!
	// }

	const farmDetails = await getFarmDetailsByUserIdUseCase(session!.user.id!)

	return (
		<div className="w-full lg:grid lg:grid-cols-2">
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

					<Card>
						<CardHeader>
							<CardTitle> Complete Farm Details</CardTitle>
							<CardDescription>
								Enter your farm details to complete your farmer account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CompleteFarmerDetailsForm
								farmDetails={farmDetails}
								farmerEmail={session?.user.email || ""}
							/>
						</CardContent>
					</Card>
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
