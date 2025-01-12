"use client"
import { FPContactNumberDisplay } from "@/components/fp/fp-contact-number"
import { Lightbox } from "@/components/fp/fp-light-box"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { getFarmerById } from "@/data-access/farmers"
import { cn } from "@/lib/utils"
import { FarmerApplicationStatus } from "@prisma/client"
import { Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Fragment, useState } from "react"
import { AddressDetailsDrawerDialog } from "../../../_components/address-details"
import { FarmerApprovalBadge } from "../../../_components/badges"
import { ApproveFarmer } from "./approve-farmer"
import { RejectFarmerDrawerDialog } from "./reject-farmer"

interface FarmDetailsProps {
	farmer: Awaited<ReturnType<typeof getFarmerById>>
}

export default function FarmerDetails({ farmer }: FarmDetailsProps) {
	const [lightboxOpen1, setLightboxOpen1] = useState(false)
	const [lightboxOpen2, setLightboxOpen2] = useState(false)
	const [lightboxOpen3, setLightboxOpen3] = useState(false)
	if (!farmer) return null

	return (
		<Card className="">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Avatar className="h-14 w-14">
							<AvatarImage
								src={
									farmer.profilePicture || "/placeholder.svg?height=56&width=56"
								}
								className="object-cover"
								alt="Edesio Alconera"
							/>
							<AvatarFallback>{farmer.name?.[0]}</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className="text-xl capitalize">
								{farmer.name}
							</CardTitle>
							<p className="text-sm text-muted-foreground">FARMER</p>
						</div>
					</div>
					{farmer.applicationStatus && (
						<FarmerApprovalBadge status={farmer.applicationStatus} />
					)}
				</div>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<h3 className="text-sm font-semibold">Email</h3>
						<p className="text-sm">{farmer.user.email}</p>
					</div>
					<div>
						<h3 className="text-sm font-semibold">Birth Date</h3>
						<p className="text-sm">{farmer.birthDate?.toLocaleDateString()}</p>
					</div>
					<div>
						<h3 className="text-sm font-semibold">Contact Number</h3>
						{farmer.contactNumber && (
							<FPContactNumberDisplay contactNumber={farmer.contactNumber} />
						)}
					</div>
					<div>
						<h3 className="text-sm font-semibold">Farm Name</h3>
						<p className="text-sm">{farmer.farmName || farmer.name}</p>
					</div>
				</div>
				<div>
					<h3 className="text-sm font-semibold">Address</h3>
					<p className="text-sm">{farmer.address[0].fullAddress}</p>
					<AddressDetailsDrawerDialog address={farmer.address[0]} />
				</div>
				<div>
					<h3 className="text-sm font-semibold">Farm Description</h3>
					<p className="text-sm">{farmer.farmDescription}</p>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<h3 className="mb-2 text-sm font-semibold">Government ID</h3>
						{farmer.govIdImage && (
							<>
								<div className="relative h-48 w-full rounded-lg border object-cover">
									<div className="relative h-full w-full">
										<div
											className="absolute inset-0 z-40 h-full w-full cursor-pointer"
											onClick={() => setLightboxOpen1(true)}
										></div>
										{lightboxOpen1 && farmer.govIdImage && (
											<Lightbox
												images={[farmer.govIdImage]}
												currentIndex={0}
												onClose={() => setLightboxOpen1(false)}
											/>
										)}
										<Image
											src={farmer.govIdImage}
											alt="Uploaded image"
											fill
											priority
											className={cn(
												"h-full w-full rounded-lg object-cover",
												"h-48 w-full object-cover"
											)}
										/>
									</div>
								</div>
							</>
						)}
					</div>
					<div>
						<h3 className="mb-2 text-sm font-semibold">
							Selfie with Government ID
						</h3>
						{farmer.selfieWithGovIdImage && (
							<>
								<div className="relative h-48 w-full rounded-lg border object-cover">
									<div className="relative h-full w-full">
										<div
											className="absolute inset-0 z-40 h-full w-full cursor-pointer"
											onClick={() => setLightboxOpen2(true)}
										></div>
										{lightboxOpen2 && farmer.selfieWithGovIdImage && (
											<Lightbox
												images={[farmer.selfieWithGovIdImage]}
												currentIndex={0}
												onClose={() => setLightboxOpen2(false)}
											/>
										)}
										<Image
											src={farmer.selfieWithGovIdImage}
											alt="Uploaded image"
											fill
											priority
											className={cn(
												"h-full w-full rounded-lg object-cover",
												"h-48 w-full object-cover"
											)}
										/>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
				<div>
					<h3 className="mb-2 text-sm font-semibold">Farm Images</h3>
					<div className="grid grid-cols-3 gap-2">
						{farmer.farmImages.map((image, index) => (
							<Fragment key={image}>
								<div className="relative aspect-square h-full w-full">
									<div
										className="absolute inset-0 z-50 h-full w-full cursor-pointer"
										onClick={() => setLightboxOpen3(true)}
									></div>
									{lightboxOpen3 && farmer.farmImages.length > 0 && (
										<Lightbox
											images={farmer.farmImages}
											currentIndex={index}
											onClose={() => setLightboxOpen3(false)}
										/>
									)}
									<Image
										src={image || "/placeholder.svg"}
										alt="Uploaded image"
										fill
										priority
										className={cn("h-full w-full rounded-lg object-cover")}
									/>
								</div>
							</Fragment>
						))}
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-2 lg:flex-row lg:justify-end">
				<Button variant="outline" size="lg" className="max-md:w-full" asChild>
					<Link href={`/dashboard/users/${farmer.user?.id}/edit`}>
						<Edit className="mr-2 h-4 w-4" /> Edit
					</Link>
				</Button>
				{farmer.applicationStatus === FarmerApplicationStatus.PENDING && (
					<div className="flex gap-2 max-md:w-full max-md:flex-col">
						<RejectFarmerDrawerDialog farmerId={farmer.id} />
						<ApproveFarmer farmerId={farmer.id} />
					</div>
				)}
			</CardFooter>
		</Card>
	)
}
