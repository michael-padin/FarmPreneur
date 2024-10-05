import nodemailer from "nodemailer"

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
	const mailOptions = {
		from: process.env.EMAIL_USER,
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
