import React from "react"
import {
	User,
	VerificationDocument,
	Farmer,
	Product,
	Image as ImageType,
	Address
} from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	MapPin,
	Phone,
	Mail,
	Calendar,
	Tractor,
	FileText,
	Package,
	DollarSign
} from "lucide-react"

interface UserDetailsProps {
	user: User & Farmer & Address & ImageType
}

export default function EnhancedUserDetails({ user }: UserDetailsProps) {
	return (
		<></>
		// <Card className="mx-auto w-full max-w-6xl shadow-lg">
		// 	<CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
		// 		<div className="flex items-center space-x-4">
		// 			<Avatar className="h-24 w-24 border-4 border-white shadow-lg">
		// 				<AvatarImage
		// 					src={user.profilePicture?.url || "/placeholder.svg"}
		// 					alt={user.name || "User"}
		// 				/>
		// 				<AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
		// 			</Avatar>
		// 			<div>
		// 				<CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
		// 				<CardDescription className="text-lg text-gray-100">
		// 					{user.role}
		// 				</CardDescription>
		// 				<Badge variant="secondary" className="mt-2 text-sm">
		// 					{user.farmerApplicationStatus || "N/A"}
		// 				</Badge>
		// 			</div>
		// 		</div>
		// 	</CardHeader>
		// 	<CardContent className="p-6">
		// 		<Tabs defaultValue="personal" className="w-full">
		// 			<TabsList className="mb-6 grid w-full grid-cols-3">
		// 				<TabsTrigger value="personal">Personal Info</TabsTrigger>
		// 				<TabsTrigger value="farm">Farm Details</TabsTrigger>
		// 				<TabsTrigger value="products">Products</TabsTrigger>
		// 			</TabsList>
		// 			<TabsContent value="personal">
		// 				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
		// 					<Card>
		// 						<CardHeader>
		// 							<CardTitle>Contact Information</CardTitle>
		// 						</CardHeader>
		// 						<CardContent>
		// 							<ul className="space-y-3">
		// 								<li className="flex items-center">
		// 									<Mail className="mr-2 h-5 w-5 text-blue-500" />{" "}
		// 									{user.email}
		// 								</li>
		// 								<li className="flex items-center">
		// 									<Phone className="mr-2 h-5 w-5 text-green-500" />{" "}
		// 									{user.contactNumber || "Not provided"}
		// 								</li>
		// 								<li className="flex items-center">
		// 									<Calendar className="mr-2 h-5 w-5 text-purple-500" />{" "}
		// 									{user.birthDate
		// 										? new Date(user.birthDate).toLocaleDateString()
		// 										: "Not provided"}
		// 								</li>
		// 								<li className="flex items-center">
		// 									<MapPin className="mr-2 h-5 w-5 text-red-500" />{" "}
		// 									{user.address?.fullAddress || "Not provided"}
		// 								</li>
		// 							</ul>
		// 						</CardContent>
		// 					</Card>
		// 					<Card>
		// 						<CardHeader>
		// 							<CardTitle>Verification Documents</CardTitle>
		// 						</CardHeader>
		// 						<CardContent>
		// 							{user.verificationDocument ? (
		// 								<div className="flex items-center space-x-4">
		// 									<FileText className="h-10 w-10 text-blue-500" />
		// 									<div>
		// 										<p className="font-semibold">
		// 											{user.verificationDocument.type}
		// 										</p>
		// 										{user.verificationDocument.image && (
		// 											<Image
		// 												src={user.verificationDocument.image.url}
		// 												alt="Verification Document"
		// 												width={150}
		// 												height={150}
		// 												className="mt-2 rounded-lg shadow-md"
		// 											/>
		// 										)}
		// 									</div>
		// 								</div>
		// 							) : (
		// 								<p className="italic text-gray-500">
		// 									No verification documents provided
		// 								</p>
		// 							)}
		// 						</CardContent>
		// 					</Card>
		// 				</div>
		// 			</TabsContent>
		// 			<TabsContent value="farm">
		// 				{user.farmDetails ? (
		// 					<Card>
		// 						<CardHeader>
		// 							<CardTitle className="flex items-center">
		// 								<Tractor className="mr-2 h-6 w-6 text-green-600" />
		// 								{user.farmDetails.farmName || "Unnamed Farm"}
		// 							</CardTitle>
		// 						</CardHeader>
		// 						<CardContent>
		// 							<p className="mb-4 text-gray-700">
		// 								{user.farmDetails.farmDescription}
		// 							</p>
		// 							<div className="mb-4 flex items-center">
		// 								<MapPin className="mr-2 h-5 w-5 text-red-500" />
		// 								<span>
		// 									{user.farmDetails.address?.fullAddress ||
		// 										"Farm address not provided"}
		// 								</span>
		// 							</div>
		// 							<div className="mb-6">
		// 								<h4 className="mb-2 text-lg font-semibold">
		// 									Farm Products
		// 								</h4>
		// 								<div className="flex flex-wrap gap-2">
		// 									{user.farmDetails.products.map((product, index) => (
		// 										<Badge key={index} variant="secondary">
		// 											{product}
		// 										</Badge>
		// 									))}
		// 								</div>
		// 							</div>
		// 							<div>
		// 								<h4 className="mb-2 text-lg font-semibold">Farm Images</h4>
		// 								<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
		// 									{user.farmDetails.images.map((image, index) => (
		// 										<Image
		// 											key={index}
		// 											src={image.url}
		// 											alt={`Farm image ${index + 1}`}
		// 											width={200}
		// 											height={200}
		// 											className="h-40 w-full rounded-lg object-cover shadow-md"
		// 										/>
		// 									))}
		// 								</div>
		// 							</div>
		// 						</CardContent>
		// 					</Card>
		// 				) : (
		// 					<Card>
		// 						<CardContent>
		// 							<p className="py-8 text-center italic text-gray-500">
		// 								No farm details available
		// 							</p>
		// 						</CardContent>
		// 					</Card>
		// 				)}
		// 			</TabsContent>
		// 			<TabsContent value="products">
		// 				<ScrollArea className="h-[600px] pr-4">
		// 					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
		// 						{user.products.map((product) => (
		// 							<Card key={product.id} className="flex flex-col">
		// 								<CardHeader>
		// 									<CardTitle className="flex items-center justify-between">
		// 										<span>{product.title}</span>
		// 										<Badge
		// 											variant={
		// 												product.listingStatus === "APPROVED"
		// 													? "success"
		// 													: "secondary"
		// 											}
		// 										>
		// 											{product.listingStatus}
		// 										</Badge>
		// 									</CardTitle>
		// 								</CardHeader>
		// 								<CardContent>
		// 									{product.images.length > 0 && (
		// 										<Image
		// 											src={product.images[0].url}
		// 											alt={product.title}
		// 											width={300}
		// 											height={200}
		// 											className="mb-4 h-48 w-full rounded-lg object-cover shadow-md"
		// 										/>
		// 									)}
		// 									<p className="mb-4 text-gray-600">
		// 										{product.description}
		// 									</p>
		// 									<div className="flex items-center justify-between">
		// 										<div className="flex items-center">
		// 											<Package className="mr-2 h-5 w-5 text-blue-500" />
		// 											<span>
		// 												{product.quantity} {product.unit}
		// 											</span>
		// 										</div>
		// 										<div className="flex items-center text-lg font-semibold">
		// 											<DollarSign className="mr-1 h-5 w-5 text-green-500" />
		// 											<span>{product.price.toFixed(2)}</span>
		// 										</div>
		// 									</div>
		// 								</CardContent>
		// 							</Card>
		// 						))}
		// 					</div>
		// 				</ScrollArea>
		// 			</TabsContent>
		// 		</Tabs>
		// 	</CardContent>
		// 	<CardFooter className="flex justify-end space-x-2 bg-gray-50 p-4">
		// 		<Button variant="outline">Edit Profile</Button>
		// 		<Button>Contact User</Button>
		// 	</CardFooter>
		// </Card>
	)
}
