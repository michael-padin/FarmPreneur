"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Bell,
	CheckCircle,
	Clock,
	ListPlus,
	PackageCheck,
	ShoppingBag,
	Store,
	ThumbsUp,
	UserCheck,
	UserPlus
} from "lucide-react"
import { useState } from "react"

const FarmerSteps = [
	{
		icon: <UserPlus className="h-6 w-6" />,
		description: "Register as a farmer"
	},
	{
		icon: <Clock className="h-6 w-6" />,
		description: "Wait for admin approval"
	},
	{ icon: <ListPlus className="h-6 w-6" />, description: "List your products" },
	{ icon: <ShoppingBag className="h-6 w-6" />, description: "Receive orders" },
	{ icon: <PackageCheck className="h-6 w-6" />, description: "Prepare orders" },
	{
		icon: <UserCheck className="h-6 w-6" />,
		description: "Wait for customer pickup"
	},
	{ icon: <CheckCircle className="h-6 w-6" />, description: "Order completed" }
]

const CustomerSteps = [
	{
		icon: <UserPlus className="h-6 w-6" />,
		description: "Register as a customer"
	},
	{
		icon: <Store className="h-6 w-6" />,
		description: "Browse products from local farmers"
	},
	{ icon: <ShoppingBag className="h-6 w-6" />, description: "Place an order" },
	{
		icon: <Bell className="h-6 w-6" />,
		description: "Receive notification when order is ready"
	},
	{
		icon: <PackageCheck className="h-6 w-6" />,
		description: "Pick up fresh products from the farmer's location"
	},
	{
		icon: <CheckCircle className="h-6 w-6" />,
		description: "Confirm picked up order"
	},
	{
		icon: <ThumbsUp className="h-6 w-6" />,
		description: "Rate your experience and leave feedback"
	}
]

function StepList({ steps }: { steps: typeof FarmerSteps }) {
	const [currentStep, setCurrentStep] = useState(0)

	return (
		<div className="space-y-4">
			<div className="flex items-center space-x-4 rounded-lg bg-muted p-4">
				<div className="rounded-full bg-primary/10 p-2 text-primary">
					{steps[currentStep].icon}
				</div>
				<div className="flex-1">
					<h3 className="font-semibold">Step {currentStep + 1}</h3>
					<p>{steps[currentStep].description}</p>
				</div>
			</div>
			<div className="flex justify-between">
				<Button
					variant="outline"
					onClick={() =>
						setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))
					}
				>
					Previous
				</Button>
				<Button
					onClick={() =>
						setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))
					}
				>
					Next
				</Button>
			</div>
			<div className="flex justify-center space-x-2">
				{steps.map((_, index) => (
					<Button
						key={index}
						variant="ghost"
						className={`h-8 w-8 p-0 ${index === currentStep ? "bg-primary text-primary-foreground" : ""}`}
						onClick={() => setCurrentStep(index)}
					>
						{index + 1}
					</Button>
				))}
			</div>
		</div>
	)
}

export function HowItWorksDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="secondary">How It Works</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>How It Works</DialogTitle>
					<DialogDescription>
						Learn how our platform connects farmers and customers.
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="farmer" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="farmer">For Farmers</TabsTrigger>
						<TabsTrigger value="customer">For Customers</TabsTrigger>
					</TabsList>
					<TabsContent value="farmer">
						<StepList steps={FarmerSteps} />
					</TabsContent>
					<TabsContent value="customer">
						<StepList steps={CustomerSteps} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
