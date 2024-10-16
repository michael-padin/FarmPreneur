"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

type User = {
	id: string
	name: string | null
	email: string | null
	emailVerified: Date | null
	image: string | null
	isSellerApproved: boolean
	role: "FARMER" | "BUYER" | "ADMIN" | null
	contactNumber: string | null
	isVerified: boolean
	profilePicture: string | null
	createdAt: Date
	updatedAt: Date
}

export default function UserDetails({ params }: { params: { id: string } }) {
	const id = params.id
	const [user, setUser] = useState<User | null>(null)
	const [isEditing, setIsEditing] = useState(false)

	useEffect(() => {
		// In a real application, you would fetch the user data from an API
		// For this example, we'll use mock data
		if (id) {
			const mockUser: User = {
				id: id as string,
				name: `User ${id}`,
				email: `user${id}@example.com`,
				emailVerified: new Date(),
				image: null,
				isSellerApproved: Math.random() > 0.5,
				role: ["FARMER", "BUYER", "ADMIN"][
					Math.floor(Math.random() * 3)
				] as User["role"],
				contactNumber: "+1234567890",
				isVerified: Math.random() > 0.3,
				profilePicture: null,
				createdAt: new Date(
					Date.now() - Math.floor(Math.random() * 10000000000)
				),
				updatedAt: new Date()
			}
			setUser(mockUser)
		}
	}, [id])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (user) {
			setUser({ ...user, [e.target.name]: e.target.value })
		}
	}

	const handleRoleChange = (value: User["role"]) => {
		if (user) {
			setUser({ ...user, role: value })
		}
	}

	const handleCheckboxChange = (name: string, checked: boolean) => {
		if (user) {
			setUser({ ...user, [name]: checked })
		}
	}

	const handleSave = () => {
		// In a real application, you would send the updated user data to an API
		console.log("Saving user:", user)
		setIsEditing(false)
	}

	if (!user) {
		return <div>Loading...</div>
	}

	return (
		<Card className="mx-auto w-full max-w-4xl">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-2xl font-bold">User Profile</CardTitle>
				<Button onClick={() => setIsEditing(!isEditing)}>
					{isEditing ? "Cancel" : "Edit"}
				</Button>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="details" className="w-full">
					<TabsList>
						<TabsTrigger value="details">Details</TabsTrigger>
						<TabsTrigger value="security">Security</TabsTrigger>
						{user.role === "FARMER" && (
							<TabsTrigger value="seller">Seller Info</TabsTrigger>
						)}
					</TabsList>
					<TabsContent value="details">
						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<Avatar className="h-20 w-20">
									<AvatarImage
										src={user.profilePicture || undefined}
										alt={user.name || "User"}
									/>
									<AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-2xl font-semibold">{user.name}</h3>
									<p className="text-sm text-muted-foreground">{user.email}</p>
								</div>
							</div>
							<Separator />
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										name="name"
										value={user.name || ""}
										onChange={handleInputChange}
										disabled={!isEditing}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={user.email || ""}
										onChange={handleInputChange}
										disabled={!isEditing}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="contactNumber">Contact Number</Label>
									<Input
										id="contactNumber"
										name="contactNumber"
										value={user.contactNumber || ""}
										onChange={handleInputChange}
										disabled={!isEditing}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="role">Role</Label>
									<Select
										value={user.role || undefined}
										onValueChange={handleRoleChange}
										disabled={!isEditing}
									>
										<SelectTrigger id="role">
											<SelectValue placeholder="Select a role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="FARMER">Farmer</SelectItem>
											<SelectItem value="BUYER">Buyer</SelectItem>
											<SelectItem value="ADMIN">Admin</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex space-x-4">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="isVerified"
										checked={user.isVerified}
										onCheckedChange={(checked) =>
											handleCheckboxChange("isVerified", checked as boolean)
										}
										disabled={!isEditing}
									/>
									<Label htmlFor="isVerified">Verified</Label>
								</div>
								{user.role === "FARMER" && (
									<div className="flex items-center space-x-2">
										<Checkbox
											id="isSellerApproved"
											checked={user.isSellerApproved}
											onCheckedChange={(checked) =>
												handleCheckboxChange(
													"isSellerApproved",
													checked as boolean
												)
											}
											disabled={!isEditing}
										/>
										<Label htmlFor="isSellerApproved">Seller Approved</Label>
									</div>
								)}
							</div>
						</div>
					</TabsContent>
					<TabsContent value="security">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>Email Verification</Label>
								<Badge variant={user.emailVerified ? "default" : "destructive"}>
									{user.emailVerified ? "Verified" : "Not Verified"}
								</Badge>
							</div>
							<Button variant="outline">Change Password</Button>
						</div>
					</TabsContent>
					{user.role === "FARMER" && (
						<TabsContent value="seller">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Seller Status</Label>
									<Badge
										variant={user.isSellerApproved ? "default" : "outline"}
									>
										{user.isSellerApproved ? "Approved" : "Pending Approval"}
									</Badge>
								</div>
								<Button variant="outline">View Farm Details</Button>
								<Button variant="outline">Manage Products</Button>
							</div>
						</TabsContent>
					)}
				</Tabs>
				<Separator className="my-6" />
				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<span>Created: {user.createdAt.toLocaleDateString()}</span>
					<span>Last Updated: {user.updatedAt.toLocaleDateString()}</span>
				</div>
				{isEditing && (
					<Button onClick={handleSave} className="mt-6 w-full">
						Save Changes
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
