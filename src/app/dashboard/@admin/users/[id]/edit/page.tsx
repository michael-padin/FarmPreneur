"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
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

type User = {
	id: string
	name: string
	email: string
	role: "FARMER" | "BUYER" | "ADMIN"
	isSellerApproved: boolean
	isVerified: boolean
	createdAt: string
}

export default function UserDetails() {
	const router = useRouter()
	const { id } = router.query
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
				role: ["FARMER", "BUYER", "ADMIN"][
					Math.floor(Math.random() * 3)
				] as User["role"],
				isSellerApproved: Math.random() > 0.5,
				isVerified: Math.random() > 0.3,
				createdAt: new Date(
					Date.now() - Math.floor(Math.random() * 10000000000)
				).toISOString()
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
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader>
				<CardTitle>{isEditing ? "Edit User" : "User Details"}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Badge variant="outline">ID: {user.id}</Badge>
						<Button onClick={() => setIsEditing(!isEditing)}>
							{isEditing ? "Cancel" : "Edit"}
						</Button>
					</div>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								value={user.name}
								onChange={handleInputChange}
								disabled={!isEditing}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={user.email}
								onChange={handleInputChange}
								disabled={!isEditing}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="role">Role</Label>
							<Select
								value={user.role}
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
										handleCheckboxChange("isSellerApproved", checked as boolean)
									}
									disabled={!isEditing}
								/>
								<Label htmlFor="isSellerApproved">Seller Approved</Label>
							</div>
						)}
						<div className="grid gap-2">
							<Label>Created At</Label>
							<div>{new Date(user.createdAt).toLocaleString()}</div>
						</div>
					</div>
					{isEditing && (
						<Button onClick={handleSave} className="w-full">
							Save Changes
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
