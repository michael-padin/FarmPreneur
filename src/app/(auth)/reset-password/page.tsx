import Link from "next/link"
import Image from "next/image"
import NewPasswordForm from "./_components/new-password-form"
import { redirect } from "next/navigation"
import { AuthLeftSection } from "../_components/auth-left-section"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { AuthRightSection } from "../_components/auth-right-section"

export default async function ResetPasswordPage(props: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const searchParams = await props.searchParams
	if (!searchParams?.token) {
		return redirect("/login")
	}
	return (
		<>
			<AuthLeftSection>
				<Card className="lg:min-w-[453.6px] lg:max-w-[453.6px] lg:border-0 lg:shadow-none">
					<CardHeader>
						<CardTitle>Reset Password</CardTitle>
						<CardDescription>Enter your new password below.</CardDescription>
					</CardHeader>
					<CardContent>
						<NewPasswordForm token={searchParams?.token as string} />
					</CardContent>
				</Card>
			</AuthLeftSection>
			<AuthRightSection
				imageProps={{ src: "/auth2.svg", alt: "Reset Password Image" }}
			/>
		</>
	)
}
