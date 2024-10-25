"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Cross, Pen } from "lucide-react"

const userFormSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email({ message: "Please enter a valid email address." }),
	role: z.enum(["ADMIN", "FARMER", "BUYER"]),
	contactNumber: z
		.string()
		.min(10, { message: "Contact number must be at least 10 characters." }),
	isVerified: z.boolean(),
	profilePicture: z.string().optional()
})

const farmFormSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Farm name must be at least 2 characters." }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters." }),
	location: z
		.string()
		.min(5, { message: "Location must be at least 5 characters." }),
	yearsOfExperience: z.number().min(0),
	size: z.number().min(0).optional(),
	products: z
		.array(z.string())
		.min(1, { message: "Please enter at least one product." }),
	images: z.array(z.string()).optional()
})

type UserFormValues = z.infer<typeof userFormSchema>
type FarmFormValues = z.infer<typeof farmFormSchema>

const mockUser: UserFormValues = {
	name: "John Doe",
	email: "john.doe@example.com",
	role: "FARMER",
	contactNumber: "+1 (555) 123-4567",
	isVerified: true,
	profilePicture: "https://i.pravatar.cc/300"
}

const mockFarm: FarmFormValues = {
	name: "Green Acres Farm",
	description:
		"A sustainable farm producing organic vegetables and free-range eggs.",
	location: "123 Rural Road, Farmville, CA 90210",
	yearsOfExperience: 15,
	size: 50,
	products: ["Tomatoes", "Lettuce", "Carrots", "Eggs"],
	images: [
		"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop",
		"https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=500&h=500&fit=crop"
	]
}

export default function RefinedEnterpriseAdminPage() {
	const [isEditing, setIsEditing] = useState(false)

	const userForm = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: mockUser
	})

	const farmForm = useForm<FarmFormValues>({
		resolver: zodResolver(farmFormSchema),
		defaultValues: mockFarm
	})

	function onUserSubmit(data: UserFormValues) {
		toast({
			title: "User details updated",
			description: "The user information has been successfully updated."
		})
		setIsEditing(false)
	}

	function onFarmSubmit(data: FarmFormValues) {
		toast({
			title: "Farm details updated",
			description: "The farm information has been successfully updated."
		})
		setIsEditing(false)
	}

	return (
		<div className="container mx-auto space-y-8 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-4xl font-bold text-primary">
					Farm Management Dashboard
				</h1>
				<Button onClick={() => setIsEditing(!isEditing)} variant="outline">
					{isEditing ? (
						<>
							<Cross className="mr-2 h-4 w-4" /> Cancel Editing
						</>
					) : (
						<>
							<Pen className="mr-2 h-4 w-4" /> Edit Details
						</>
					)}
				</Button>
			</div>

			<Tabs defaultValue="user" className="w-full">
				<TabsList className="mb-8 grid w-full grid-cols-2">
					<TabsTrigger value="user">User Profile</TabsTrigger>
					<TabsTrigger value="farm">Farm Details</TabsTrigger>
				</TabsList>
				<TabsContent value="user">
					<Card className="border-2 border-primary/20">
						<CardHeader>
							<CardTitle className="text-2xl text-primary">
								User Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...userForm}>
								<form
									onSubmit={userForm.handleSubmit(onUserSubmit)}
									className="space-y-6"
								>
									<div className="flex items-center space-x-6">
										<Avatar className="h-24 w-24 border-2 border-primary">
											<AvatarImage
												src={mockUser.profilePicture}
												alt={mockUser.name}
											/>
											<AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<h2 className="text-3xl font-bold text-primary">
												{mockUser.name}
											</h2>
											<Badge
												variant={mockUser.isVerified ? "default" : "secondary"}
												className="mt-2"
											>
												{mockUser.isVerified ? "Verified" : "Unverified"}
											</Badge>
										</div>
									</div>

									<ScrollArea className="h-[400px] rounded-md border-2 border-primary/20 p-6">
										<div className="space-y-6">
											<FormField
												control={userForm.control}
												name="profilePicture"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Profile Picture</FormLabel>
														<FormControl>
															<div className="flex items-center space-x-4">
																<Input
																	type="file"
																	accept="image/*"
																	onChange={(e) => {
																		const file = e.target.files?.[0]
																		if (file) {
																			const reader = new FileReader()
																			reader.onloadend = () => {
																				field.onChange(reader.result as string)
																			}
																			reader.readAsDataURL(file)
																		}
																	}}
																	disabled={!isEditing}
																/>
																{field.value && (
																	<img
																		src={field.value}
																		alt="Profile"
																		className="h-16 w-16 rounded-full object-cover"
																	/>
																)}
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={userForm.control}
												name="name"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Name</FormLabel>
														<FormControl>
															<Input {...field} disabled={!isEditing} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={userForm.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email</FormLabel>
														<FormControl>
															<Input {...field} disabled={!isEditing} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={userForm.control}
												name="contactNumber"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Contact Number</FormLabel>
														<FormControl>
															<Input {...field} disabled={!isEditing} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={userForm.control}
												name="role"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Role</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
															disabled={!isEditing}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select a role" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="ADMIN">Admin</SelectItem>
																<SelectItem value="FARMER">Farmer</SelectItem>
																<SelectItem value="BUYER">Buyer</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={userForm.control}
												name="isVerified"
												render={({ field }) => (
													<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
														<div className="space-y-0.5">
															<FormLabel className="text-base">
																Verified Status
															</FormLabel>
															<FormDescription>
																Is this user verified?
															</FormDescription>
														</div>
														<FormControl>
															<Switch
																checked={field.value}
																onCheckedChange={field.onChange}
																disabled={!isEditing}
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
									</ScrollArea>

									{isEditing && (
										<Button type="submit" className="w-full">
											Save User Changes
										</Button>
									)}
								</form>
							</Form>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="farm">
					<Card className="border-2 border-primary/20">
						<CardHeader>
							<CardTitle className="text-2xl text-primary">
								Farm Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...farmForm}>
								<form
									onSubmit={farmForm.handleSubmit(onFarmSubmit)}
									className="space-y-6"
								>
									<ScrollArea className="h-[500px] rounded-md border-2 border-primary/20 p-6">
										<div className="space-y-6">
											<FormField
												control={farmForm.control}
												name="name"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Farm Name</FormLabel>
														<FormControl>
															<Input {...field} disabled={!isEditing} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={farmForm.control}
												name="description"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Description</FormLabel>
														<FormControl>
															<Textarea {...field} disabled={!isEditing} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={farmForm.control}
												name="location"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Location</FormLabel>
														<FormControl>
															<Input {...field} disabled={!isEditing} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={farmForm.control}
												name="yearsOfExperience"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Years of Experience</FormLabel>
														<FormControl>
															<Input
																type="number"
																{...field}
																onChange={(e) =>
																	field.onChange(+e.target.value)
																}
																disabled={!isEditing}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={farmForm.control}
												name="size"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Farm Size (acres/hectares)</FormLabel>
														<FormControl>
															<Input
																type="number"
																{...field}
																onChange={(e) =>
																	field.onChange(+e.target.value)
																}
																disabled={!isEditing}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={farmForm.control}
												name="products"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Products (comma-separated)</FormLabel>
														<FormControl>
															<Input
																{...field}
																onChange={(e) =>
																	field.onChange(
																		e.target.value
																			.split(",")
																			.map((item) => item.trim())
																	)
																}
																disabled={!isEditing}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={farmForm.control}
												name="images"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Farm Images</FormLabel>
														<FormControl>
															<div className="space-y-4">
																<Input
																	type="file"
																	accept="image/*"
																	multiple
																	onChange={(e) => {
																		const files = e.target.files
																		if (files) {
																			const newImages = Array.from(files).map(
																				(file) => URL.createObjectURL(file)
																			)
																			field.onChange([
																				...(field.value || []),
																				...newImages
																			])
																		}
																	}}
																	disabled={!isEditing}
																/>
																<div className="grid grid-cols-2 gap-4">
																	{field.value?.map((image, index) => (
																		<div key={index} className="relative">
																			<img
																				src={image}
																				alt={`Farm ${index + 1}`}
																				className="h-40 w-full rounded-md object-cover"
																			/>
																			{isEditing && (
																				<Button
																					type="button"
																					variant="destructive"
																					size="icon"
																					className="absolute right-2 top-2"
																					onClick={() => {
																						const newImages = field.value || []
																						newImages.splice(index, 1)
																						field.onChange(newImages)
																					}}
																				>
																					<Icons.trash className="h-4 w-4" />
																				</Button>
																			)}
																		</div>
																	))}
																</div>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</ScrollArea>

									{isEditing && (
										<Button type="submit" className="w-full">
											Save Farm Changes
										</Button>
									)}
								</form>
							</Form>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
