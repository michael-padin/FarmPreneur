import { ChevronRight, MapPin, Shield, User } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "../../_components/bottom-navigation"
import { ApplicationStatus } from "./_components/application-status"
import { ProfileNavLinks } from "./_components/nav-links"
import { FarmerProfile } from "./_components/profile-header"
import { SignOutBtn } from "./_components/sign-out-btn"

export const experimental_ppr = true

export default function FarmerProfilePage() {
	return (
		<div className="h-screen overflow-auto bg-muted pb-[84.5px]">
			<header className="w-full bg-background p-4 md:hidden">
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
			<main className="bg-muted">
				<div className="">
					<div className="space-y-2 rounded-lg">
						<div className="">
							<FarmerProfile />
						</div>
						<div className="w-full px-2">
							<div className="space-y-3 rounded-lg bg-background p-4">
								<Link
									href="/dashboard/farmer/profile/edit"
									className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
								>
									<div className="flex items-center gap-3">
										<User className="h-5 w-5" />
										<span>Edit Profile</span>
									</div>
									<ChevronRight className="h-5 w-5" />
								</Link>
								<Link
									href="/dashboard/farmer/profile/address"
									className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
								>
									<div className="flex items-center gap-3">
										<MapPin className="h-5 w-5" />
										<span>Address</span>
									</div>
									<ChevronRight className="h-5 w-5" />
								</Link>
								{/* <Link
									href="profile/notifications"
									className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
								>
									<div className="flex items-center gap-3">
										<Bell className="h-5 w-5" />
										<span>Notification</span>
									</div>
									<ChevronRight className="h-5 w-5" />
								</Link> */}
								<ApplicationStatus />
								<Link
									href="/dashboard/farmer/profile/security/change-password"
									className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
								>
									<div className="flex items-center gap-3">
										<Shield className="h-5 w-5" />
										<span>Change Password</span>
									</div>
									<ChevronRight className="h-5 w-5" />
								</Link>
								{/* <Link
									href="profile/privacy"
									className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
								>
									<div className="flex items-center gap-3">
										<FileText className="h-5 w-5" />
										<span>Privacy Policy</span>
									</div>
									<ChevronRight className="h-5 w-5" />
								</Link>
								<Link
									href="profile/help"
									className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
								>
									<div className="flex items-center gap-3">
										<HelpCircle className="h-5 w-5" />
										<span>Help Center</span>
									</div>
									<ChevronRight className="h-5 w-5" />
								</Link> */}
								<SignOutBtn className="w-full p-2 hover:bg-secondary" />
							</div>
						</div>
					</div>
				</div>
			</main>
			<BottomNav />
		</div>
	)
}
