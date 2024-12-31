import { FarmerApprovedEmail } from "@/components/fp/email/fp-approved-email"
import { OTPEmail } from "@/components/fp/email/fp-otp-email"
import { FPResetPasswordEmail } from "@/components/fp/email/fp-reset-password-email"
import { render } from "@react-email/components"
import nodemailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODE_MAILER_USER, // Your Gmail address
		pass: process.env.NODE_MAILER_PASSWORD // Your App Password
	}
})

export const sendEmail = async (
	to: string,
	subject: string,
	text: string,
	html: string
) => {
	const mailOptions: MailOptions = {
		from: "no-reply@farmpremneur@gmail.com",
		to,
		subject,
		text,
		html
	}

	try {
		await transporter.sendMail(mailOptions)
	} catch (error) {
		console.error("Error sending email:", error)
		throw error // Optionally re-throw to handle it further up
	}
}

export const sendOTPEmail = async (
	to: string,
	otp: string,
	companyName: string,
	recipientName = "Valued Customer"
) => {
	const html = await render(
		OTPEmail({
			otp,
			companyName,
			recipientName
		})
	)
	await sendEmail(to, "Email Verification", otp, html)
}

export const sendApprovalEmail = async (
	to: string,
	farmerName: string,
	farmName: string
) => {
	const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/farmer`

	const html = await render(
		FarmerApprovedEmail({ dashboardUrl, farmerName, farmName })
	)
	await sendEmail(to, "Farm Approved", farmerName, html)
}

export const sendResetPasswordEmail = async (
	to: string,
	name: string,
	resetPasswordLink: string
) => {
	const html = await render(
		FPResetPasswordEmail({
			name,
			resetPasswordLink
		})
	)
	try {
		await sendEmail(to, "Password Reset", "Password Reset", html)
	} catch (error) {
		console.error("Error sending email:", error)
		throw error // Optionally re-throw to handle it further up
	}
}
