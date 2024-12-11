import { Bell, ChevronRight, MapPin, Shield, User } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "../_components"
import { CustomerInfo } from "./_components/customer-info"
import { ProfileNavLinks } from "./_components/nav-links"
import { SignOutBtn } from "./_components/sign-out-btn"

export const experimental_ppr = true

export default function CustomerProfilePage() {
	return (
		<>
			<header className="w-full p-4 md:hidden">
				<div className="">
					<div className="flex w-full items-center justify-between">
						<div className="">
							<h2 className={`text-xs font-bold ${"text-primary"}`}>
								FarmPreneur
							</h2>
							<h1 className="text-2xl font-bold">Profile</h1>
						</div>
						<ProfileNavLinks />
					</div>
				</div>
			</header>
			<main className="h-screen">
				<div className="">
					<div className="rounded-lg bg-background p-4">
						<div className="pb-8">
							<CustomerInfo />
						</div>
						<div className="w-full">
							<div className="">
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
								{/* <Link
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
								</Link> */}
								<SignOutBtn className="w-full" />
							</div>
						</div>
					</div>
				</div>
			</main>
			<BottomNav />
		</>
	)
}
