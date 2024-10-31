import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { SetUpFarmInfoForm } from "./_components/setup-farm-info-form"
import { getFarmDetailsByUserIdUseCase } from "@/use-cases/farm-details"

export default async function Page() {
	// const session = await auth()

	// if (!session) {
	// 	redirect("/login")!
	// }

	const farmDetails = await getFarmDetailsByUserIdUseCase("id")

	return (
		<div>
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
					<SetUpFarmInfoForm
						farmDetails={farmDetails}
						// farmDetails={farmDetails}
						// farmerEmail={session?.user.email || ""}
						// verificationDocument={verificationDocument}
						// farmDetails={farmDetails}
						// farmerEmail={session?.user.email || ""}
						// verificationDocument={verificationDocument}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
