"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
	MapPin,
	Phone,
	Mail,
	Calendar,
	Briefcase,
	CheckCircle,
	XCircle,
	User,
	Tractor,
	FileText,
	MapPinned
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock data based on the schema (same as before)
const user = {
	id: "1",
	name: "John Doe",
	email: "john@example.com",
	emailVerified: new Date("2023-01-01"),
	image: "/placeholder.svg?height=100&width=100",
	role: "TractorER",
	contactNumber: "+1234567890",
	isVerified: true,
	profilePicture: "/placeholder.svg?height=100&width=100",
	createdAt: new Date("2022-01-01"),
	farmDetails: [
		{
			id: "1",
			name: "Green Acres Tractor",
			description:
				"Organic vegetable farm specializing in heirloom varieties and sustainable farming practices.",
			location: "Countryside, State",
			yearsOfExperience: 10,
			size: 50,
			products: ["Tomatoes", "Lettuce", "Carrots", "Peppers", "Cucumbers"],
			images: [
				"/placeholder.svg?height=200&width=200",
				"/placeholder.svg?height=200&width=200",
				"/placeholder.svg?height=200&width=200"
			]
		}
	],
	verificationDocuments: [
		{
			id: "1",
			type: "GOVERNMENT_ID",
			url: "/placeholder.svg?height=50&width=50"
		},
		{
			id: "2",
			type: "FARM_CERTIFICATION",
			url: "/placeholder.svg?height=50&width=50"
		},
		{
			id: "3",
			type: "BUSINESS_LICENSE",
			url: "/placeholder.svg?height=50&width=50"
		}
	],
	address: {
		fullAddress: "123 Farm Road, Countryside, State, 12345",
		street: "123 Farm Road",
		region: "State",
		country: "Country",
		postalCode: "12345",
		latitude: 40.7128,
		longitude: -74.006
	}
}

export default function UserDetailsPage() {
	const [isEditing, setIsEditing] = useState(false)

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } }
	}

	return (
		<div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
			<motion.div initial="hidden" animate="visible" variants={fadeIn}>
				<Card>
					<CardHeader>
						<div className="flex justify-between">
							<div className="space-y-1.5">
								<CardTitle>User Information</CardTitle>
								<CardDescription>
									View and manage your personal details
								</CardDescription>
							</div>
							<Link
								href="/dashboard/users"
								className={cn(
									buttonVariants({
										variant: "default"
									})
								)}
							>
								Edit{" "}
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="overview" className="w-full">
							<TabsList className="mb-8 grid w-full grid-cols-2 lg:grid-cols-4">
								<TabsTrigger
									value="overview"
									className="flex items-center justify-center"
								>
									<User className="mr-2 h-4 w-4" /> Overview
								</TabsTrigger>
								<TabsTrigger
									value="farm"
									className="flex items-center justify-center"
								>
									<Tractor className="mr-2 h-4 w-4" /> Farm Details
								</TabsTrigger>
								<TabsTrigger
									value="documents"
									className="flex items-center justify-center"
								>
									<FileText className="mr-2 h-4 w-4" /> Documents
								</TabsTrigger>
								<TabsTrigger
									value="address"
									className="flex items-center justify-center"
								>
									<MapPinned className="mr-2 h-4 w-4" /> Address
								</TabsTrigger>
							</TabsList>
							<TabsContent value="overview">
								<Card>
									<CardHeader>
										<CardTitle>Overview</CardTitle>
										<CardDescription></CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
											<Avatar className="h-24 w-24">
												<AvatarImage
													src={user.profilePicture}
													alt={user.name}
												/>
												<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
											</Avatar>
											<div className="text-center sm:text-left">
												<h2 className="text-2xl font-bold">{user.name}</h2>
												<p className="text-muted-foreground">{user.email}</p>
												<div className="mt-2">
													<Badge
														variant={
															user.isVerified ? "default" : "destructive"
														}
														className="text-xs"
													>
														{user.isVerified ? "Verified" : "Unverified"}
													</Badge>
												</div>
											</div>
										</div>
										<Separator />
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="role">Role</Label>
												<Input
													id="role"
													value={user.role}
													readOnly={!isEditing}
													className="bg-muted"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="contactNumber">Contact Number</Label>
												<div className="relative">
													<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
													<Input
														id="contactNumber"
														value={user.contactNumber}
														readOnly={!isEditing}
														className="bg-muted pl-10"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label htmlFor="emailVerified">Email Verified</Label>
												<div className="relative">
													<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
													<Input
														id="emailVerified"
														value={user.emailVerified.toLocaleDateString()}
														readOnly
														className="bg-muted pl-10"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label htmlFor="memberSince">Member Since</Label>
												<div className="relative">
													<Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
													<Input
														id="memberSince"
														value={user.createdAt.toLocaleDateString()}
														readOnly
														className="bg-muted pl-10"
													/>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="farm">
								<Card>
									<CardHeader>
										<CardTitle>Farm Details</CardTitle>
										<CardDescription>
											Information about your farm
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										{user.farmDetails.map((farm) => (
											<div key={farm.id} className="space-y-6">
												<div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
													<h3 className="text-xl font-semibold">{farm.name}</h3>
													<Badge variant="secondary">{farm.location}</Badge>
												</div>
												<p className="text-muted-foreground">
													{farm.description}
												</p>
												<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
													<div className="flex items-center space-x-2">
														<Briefcase className="h-4 w-4 text-muted-foreground" />
														<span>
															{farm.yearsOfExperience} years of experience
														</span>
													</div>
													<div className="flex items-center space-x-2">
														<MapPin className="h-4 w-4 text-muted-foreground" />
														<span>{farm.size} acres</span>
													</div>
												</div>
												<div>
													<Label className="mb-2 block">Products</Label>
													<div className="flex flex-wrap gap-2">
														{farm.products.map((product, index) => (
															<Badge key={index} variant="outline">
																{product}
															</Badge>
														))}
													</div>
												</div>
												<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
													{farm.images.map((image, index) => (
														<img
															key={index}
															src={image}
															alt={`Farm image ${index + 1}`}
															className="h-40 w-full rounded-lg object-cover"
														/>
													))}
												</div>
											</div>
										))}
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="documents">
								<Card>
									<CardHeader>
										<CardTitle>Verification Documents</CardTitle>
										<CardDescription>
											Your submitted verification documents
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ScrollArea className="h-[400px] w-full rounded-md border p-4">
											{user.verificationDocuments.map((doc, index) => (
												<div
													key={doc.id}
													className="mb-4 flex items-center space-x-4"
												>
													<img
														src={doc.url}
														alt={doc.type}
														className="h-16 w-16 rounded-md object-cover"
													/>
													<div className="flex-1">
														<p className="font-medium">
															{doc.type.replace("_", " ")}
														</p>
														<p className="text-sm text-muted-foreground">
															Uploaded document
														</p>
													</div>
													{user.isVerified ? (
														<CheckCircle className="h-5 w-5 text-green-500" />
													) : (
														<XCircle className="h-5 w-5 text-red-500" />
													)}
													{index !== user.verificationDocuments.length - 1 && (
														<Separator className="my-4" />
													)}
												</div>
											))}
										</ScrollArea>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="address">
								<Card>
									<CardHeader>
										<CardTitle>Address Information</CardTitle>
										<CardDescription>
											Your registered address details
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="space-y-2">
											<Label htmlFor="fullAddress">Full Address</Label>
											<Textarea
												id="fullAddress"
												value={user.address.fullAddress}
												readOnly={!isEditing}
												className="min-h-[100px] bg-muted"
											/>
										</div>
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="street">Street</Label>
												<Input
													id="street"
													value={user.address.street}
													readOnly={!isEditing}
													className="bg-muted"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="region">Region</Label>
												<Input
													id="region"
													value={user.address.region}
													readOnly={!isEditing}
													className="bg-muted"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="country">Country</Label>
												<Input
													id="country"
													value={user.address.country}
													readOnly={!isEditing}
													className="bg-muted"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="postalCode">Postal Code</Label>
												<Input
													id="postalCode"
													value={user.address.postalCode}
													readOnly={!isEditing}
													className="bg-muted"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label>Coordinates</Label>
											<div className="grid grid-cols-2 gap-4">
												<Input
													value={`Latitude: ${user.address.latitude}`}
													readOnly
													className="bg-muted"
												/>
												<Input
													value={`Longitude: ${user.address.longitude}`}
													readOnly
													className="bg-muted"
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}
