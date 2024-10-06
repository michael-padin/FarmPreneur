import nodemailer from "nodemailer"
import { render } from "@react-email/components"
import { OTPEmail } from "@/components/fg/fp-otp-email"
import { MailOptions } from "nodemailer/lib/json-transport"
import { FPResetPasswordEmail } from "@/components/fg/fp-reset-password-email"

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
		console.log("Email sent successfully!")
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
