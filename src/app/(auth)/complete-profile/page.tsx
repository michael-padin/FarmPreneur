"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"
import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	User,
	Mail
} from "lucide-react"

const steps = [
	{
		title: "Personal Info",
		description: "Basic personal information",
		icon: User
	},
	{ title: "Contact", description: "Your contact details", icon: Mail },
	{ title: "Complete", description: "Profile completion", icon: CheckCircle2 }
]

export default function BeautifiedProfileStepper() {
	const [currentStep, setCurrentStep] = useState(0)

	const handleNext = () => {
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
	}

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0))
	}

	return (
		<div className="container mx-auto flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
			<Card className="mx-auto w-full max-w-4xl shadow-lg">
				<CardHeader className="pb-2">
					<CardTitle className="text-center text-2xl font-bold">
						Complete Your Profile
					</CardTitle>
					<CardDescription className="text-center">
						Follow the steps below to set up your account
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="mb-8">
						<div className="mb-4 flex items-center justify-between">
							{steps.map((step, index) => (
								<div key={step.title} className="flex flex-col items-center">
									<motion.div
										className={`flex h-12 w-12 items-center justify-center rounded-full ${
											index <= currentStep
												? "bg-primary text-primary-foreground"
												: "bg-muted text-muted-foreground"
										}`}
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ delay: index * 0.2 }}
									>
										{index < currentStep ? (
											<CheckCircle2 className="h-6 w-6" />
										) : (
											<step.icon className="h-6 w-6" />
										)}
									</motion.div>
									<div className="mt-2 hidden text-center text-sm sm:block">
										{step.title}
									</div>
								</div>
							))}
						</div>
						<div className="relative h-2 overflow-hidden rounded-full bg-muted">
							<motion.div
								className="absolute left-0 top-0 h-full rounded-full bg-primary"
								initial={{ width: 0 }}
								animate={{
									width: `${(currentStep / (steps.length - 1)) * 100}%`
								}}
								transition={{ duration: 0.5, ease: "easeInOut" }}
							/>
						</div>
					</div>

					<AnimatePresence mode="wait">
						<motion.div
							key={currentStep}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							{currentStep === 0 && (
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="firstName">First Name</Label>
											<Input id="firstName" placeholder="John" />
										</div>
										<div className="space-y-2">
											<Label htmlFor="lastName">Last Name</Label>
											<Input id="lastName" placeholder="Doe" />
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="dob">Date of Birth</Label>
										<Input id="dob" type="date" />
									</div>
								</div>
							)}

							{currentStep === 1 && (
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="john.doe@example.com"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="phone">Phone Number</Label>
										<Input
											id="phone"
											type="tel"
											placeholder="+1 (555) 000-0000"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="address">Address</Label>
										<Textarea
											id="address"
											placeholder="Enter your full address"
										/>
									</div>
								</div>
							)}

							{currentStep === 3 && (
								<div className="space-y-4 text-center">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring", stiffness: 260, damping: 20 }}
									>
										<CheckCircle2 className="mx-auto h-24 w-24 text-primary" />
									</motion.div>
									<h2 className="text-3xl font-bold">Profile Complete!</h2>
									<p className="text-lg text-muted-foreground">
										Thank you for completing your profile. Your information has
										been saved.
									</p>
								</div>
							)}
						</motion.div>
					</AnimatePresence>
				</CardContent>
				<CardFooter className="flex justify-between pt-6">
					<Button
						variant="outline"
						onClick={handlePrevious}
						disabled={currentStep === 0}
						className="w-28"
					>
						<ChevronLeft className="mr-2 h-4 w-4" />
						Previous
					</Button>
					<Button
						onClick={handleNext}
						disabled={currentStep === steps.length - 1}
						className="w-28"
					>
						{currentStep === steps.length - 2 ? "Finish" : "Next"}
						<ChevronRight className="ml-2 h-4 w-4" />
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
