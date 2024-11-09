"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check, UserPlus, User, Shield, Tractor, FileCheck } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Step = {
	id: number
	name: string
	icon: React.ElementType
	description: string
}

const steps: Step[] = [
	{
		id: 1,
		name: "Registration",
		icon: UserPlus,
		description: "Create your account with basic information."
	},
	{
		id: 2,
		name: "Account",
		icon: User,
		description: "Set up your account preferences and security settings."
	},
	{
		id: 3,
		name: "Verify OTP",
		icon: Shield,
		description: "Verify your identity with a one-time password."
	},
	{
		id: 4,
		name: "Farmer Details",
		icon: Tractor,
		description: "Provide detailed information about your farming operations."
	},
	{
		id: 5,
		name: "Admin Approval",
		icon: FileCheck,
		description: "Wait for administrative approval of your account."
	}
]

export default function FPAuthStepper({
	currentStep = 1
}: {
	currentStep?: number
}) {
	const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

	return (
		<TooltipProvider>
			<div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
				<nav aria-label="Registration Progress" className="mb-12">
					<Progress
						value={progressPercentage}
						className="h-3 w-full rounded-full"
					/>
					<p className="mt-4 text-center text-sm font-medium text-muted-foreground">
						Step {currentStep} of {steps.length} (
						{progressPercentage.toFixed(0)}% Complete)
					</p>
				</nav>
				<ol className="relative flex flex-col items-start md:flex-row md:items-center md:justify-between">
					{steps.map((step, index) => {
						const StepIcon = step.icon
						const isActive = step.id === currentStep
						const isCompleted = step.id < currentStep

						return (
							<li key={step.id} className="flex w-full items-center md:w-auto">
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="group relative flex flex-col items-center">
											<motion.div
												className={cn(
													"flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out",
													isCompleted
														? "bg-primary text-primary-foreground"
														: isActive
															? "bg-primary text-primary-foreground"
															: "bg-muted text-muted-foreground"
												)}
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{ duration: 0.3, delay: index * 0.1 }}
											>
												{isCompleted ? (
													<Check className="h-5 w-5" />
												) : (
													<StepIcon className="h-5 w-5" />
												)}
											</motion.div>
											<motion.div
												className={cn(
													"absolute -bottom-2 left-1/2 h-6 w-6 -translate-x-1/2 transform rounded-full bg-primary transition-all duration-300 ease-in-out",
													isActive
														? "scale-100 opacity-100"
														: "scale-0 opacity-0"
												)}
												initial={false}
												animate={{
													opacity: isActive ? 1 : 0,
													scale: isActive ? 1 : 0
												}}
												transition={{ duration: 0.3 }}
											/>
										</div>
									</TooltipTrigger>
									<TooltipContent
										side="bottom"
										className="max-w-xs text-center"
									>
										<p className="font-semibold">{step.name}</p>
										<p className="text-sm text-muted-foreground">
											{step.description}
										</p>
									</TooltipContent>
								</Tooltip>
								{index < steps.length - 1 && (
									<div className="mx-2 mt-8 h-0.5 flex-1 bg-muted md:mx-4 md:mt-0">
										<div
											className="h-full bg-primary transition-all duration-500 ease-in-out"
											style={{ width: `${isCompleted ? 100 : 0}%` }}
										/>
									</div>
								)}
							</li>
						)
					})}
				</ol>
			</div>
		</TooltipProvider>
	)
}
