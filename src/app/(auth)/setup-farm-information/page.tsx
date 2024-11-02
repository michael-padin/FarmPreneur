import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CompleteFarmerDetailsForm } from "./_components/farm-information-form"
import { getFarmDetailsByUserIdUseCase } from "@/use-cases/farm-details"
import { getVerificationDocumentByUserIdUseCase } from "@/use-cases/verification-document"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getUserFarmerById } from "@/data-access/users"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function Page() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	const farmDetails = await getFarmDetailsByUserIdUseCase(session!.user.id!)
	const farmer = await getUserFarmerById(session!.user.id!)

	if (farmDetails && farmer?.farmerApplicationStatus === "APPROVED")
		redirect("/dashboard/farmer")

	if (farmer?.farmerApplicationStatus === "PENDING") redirect("/admin-approval")

	return (
		<div className="w-full lg:grid lg:grid-cols-3">
			<div className="flex items-center justify-center p-4 lg:h-screen lg:overflow-hidden">
				<div className="h-full flex-1 gap-6">
					<Link
						className="my-4 flex items-center justify-center gap-2 text-3xl font-black text-[#404145] lg:hidden"
						href="/"
					>
						<h1 className="font-black text-primary lg:hidden">FarmPreneur</h1>
						<img
							src="/logo.svg"
							alt=""
							className="sr-only h-[100px] w-[100px]"
						/>
					</Link>
					<ScrollArea className="h-full">
						<Card>
							<CardHeader>
								<CardTitle>Setup Farm Information</CardTitle>
								<CardDescription>
									Setup your farm information and start selling now!
								</CardDescription>
							</CardHeader>
							<CardContent>
								<CompleteFarmerDetailsForm
									farmDetails={farmDetails}
									farmerEmail={session?.user.email || ""}
									farmerId={session?.user.id || ""}
								/>
							</CardContent>
						</Card>
					</ScrollArea>
				</div>
			</div>
			<div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:col-span-2 lg:flex">
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
						<Link href="/">FarmPreneur</Link>
					</h1>
				</div>
			</div>
		</div>
	)
}
