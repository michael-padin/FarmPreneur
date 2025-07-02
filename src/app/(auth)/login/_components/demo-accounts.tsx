"use client"

import { UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip"
import { showErrorToast } from "@/lib/handle-error"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { signInWithCredentials } from "../action"

type DemoAccount = {
	role: string
	email: string
	password: string
	label: string
	description: string
	icon: React.ReactNode
}

const demoAccounts: DemoAccount[] = [
	{
		role: "CUSTOMER",
		email: "michaelgonzalespadin@gmail.com",
		password: "michaelgonzalespadin@gmail.com",
		label: "Customer",
		description: "Browse products and place orders",
		icon: <UserIcon className="h-4 w-4" />
	},
	{
		role: "FARMER",
		email: "dealpool143@gmail.com",
		password: "dealpool143@gmail.com",
		label: "Farmer",
		description: "Manage products and track orders",
		icon: <UserIcon className="h-4 w-4" />
	},
	{
		role: "ADMIN",
		email: "padinmichael201@gmail.com",
		password: "padinmichael201@gmail.com",
		label: "Admin",
		description: "Access dashboard and analytics",
		icon: <UserIcon className="h-4 w-4" />
	}
]

export const DemoAccounts = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleDemoLogin = (account: DemoAccount) => {
		startTransition(() => {
			signInWithCredentials({
				email: account.email,
				password: account.password
			}).then((res) => {
				if (res.error) {
					showErrorToast(res.error)
					return
				}

				if (!res.data?.isEmailVerified) {
					router.push("/verify-email")
					return
				}

				router.push(DEFAULT_LOGIN_REDIRECT(res.data.role))
			})
		})
	}

	return (
		<div className="mt-6">
			<div className="relative mb-5">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Quick Access
					</span>
				</div>
			</div>

			<TooltipProvider>
				<div className="flex flex-col gap-2">
					{demoAccounts.map((account) => (
						<div key={account.role} className="relative">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										className="relative h-12 w-full justify-between"
										disabled={isPending}
										onClick={() => handleDemoLogin(account)}
									>
										<div className="flex items-center">
											{account.icon}
											<span className="ml-2">{account.label}</span>
										</div>
										<Badge variant="secondary" className="ml-2">
											Demo
										</Badge>
									</Button>
								</TooltipTrigger>
								<TooltipContent
									side="top"
									align="center"
									className="max-w-[200px] text-center"
								>
									<p>{account.description}</p>
								</TooltipContent>
							</Tooltip>
						</div>
					))}
				</div>
			</TooltipProvider>
		</div>
	)
}
