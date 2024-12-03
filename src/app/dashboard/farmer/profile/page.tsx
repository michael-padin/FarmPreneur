import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
	ChevronRight,
	HelpCircle,
	LogOut,
	MapPin,
	Bell,
	Shield,
	FileText,
	User,
	Eye,
	MessageCircleMore
} from "lucide-react"
import Link from "next/link"
import { BottomNav } from "../_components/bottom-navigation"
import { auth } from "@/auth"

export default async function FarmerProfilePage() {
	const session = await auth()

	// const farmerDetails = await getUserInfoUseCase()
	return (
		<>
			<div className="w-full pb-24">
				<div className="w-full">
					<header className="fixed left-0 right-0 top-0 z-50 w-full bg-background py-4 pb-0 md:hidden">
						<div className="mx-4 border-b">
							<div className="flex w-full items-center justify-between">
								<h1 className="text-2xl font-semibold">Profile</h1>
								<div className="flex gap-2">
									<MessageCircleMore className="stroke-primary" />
								</div>
							</div>
							<div className="py-4">
								<div className="flex flex-col">
									<Avatar className="h-24 w-24 border-4 border-primary/10">
										<AvatarImage src="/placeholder.svg" alt="Profile picture" />
										<AvatarFallback>AA</AvatarFallback>
									</Avatar>
									<div className="mt-4">
										<h1 className="text-xl font-semibold">Andrew Ainsley</h1>
									</div>
								</div>
							</div>
						</div>
					</header>
					<div className="p-4 pt-60">
						<Link
							href="/edit-profile"
							className="flex items-center justify-between rounded-lg py-2"
						>
							<div className="flex items-center gap-3">
								<User className="h-5 w-5" />
								<span>Edit Profile</span>
							</div>
							<ChevronRight className="h-5 w-5" />
						</Link>
						<Link
							href="/address"
							className="flex items-center justify-between rounded-lg py-2"
						>
							<div className="flex items-center gap-3">
								<MapPin className="h-5 w-5" />
								<span>Address</span>
							</div>
							<ChevronRight className="h-5 w-5" />
						</Link>
						<Link
							href="/notifications"
							className="flex items-center justify-between rounded-lg py-2"
						>
							<div className="flex items-center gap-3">
								<Bell className="h-5 w-5" />
								<span>Notification</span>
							</div>
							<ChevronRight className="h-5 w-5" />
						</Link>

						<Link
							href="/security"
							className="flex items-center justify-between rounded-lg py-2"
						>
							<div className="flex items-center gap-3">
								<Shield className="h-5 w-5" />
								<span>Security</span>
							</div>
							<ChevronRight className="h-5 w-5" />
						</Link>

						<div className="flex items-center justify-between rounded-lg py-2">
							<div className="flex items-center gap-3">
								<Eye className="h-5 w-5" />
								<span>Dark Mode</span>
							</div>
							<Switch />
						</div>
						<Link
							href="/privacy"
							className="flex items-center justify-between rounded-lg py-2"
						>
							<div className="flex items-center gap-3">
								<FileText className="h-5 w-5" />
								<span>Privacy Policy</span>
							</div>
							<ChevronRight className="h-5 w-5" />
						</Link>
						<Link
							href="/help"
							className="flex items-center justify-between rounded-lg py-2"
						>
							<div className="flex items-center gap-3">
								<HelpCircle className="h-5 w-5" />
								<span>Help Center</span>
							</div>
							<ChevronRight className="h-5 w-5" />
						</Link>

						<button className="flex w-full items-center gap-3 rounded-lg py-2 text-red-500">
							<LogOut className="h-5 w-5" />
							<span>Logout</span>
						</button>
					</div>
				</div>
			</div>
			<BottomNav />
		</>
	)
}
