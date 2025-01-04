import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { isDevelopment } from "@/lib/utils"
import { Notification, NotificationType } from "@prisma/client"
import { render } from "@react-email/components"
import nodemailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"

// import twilio from "twilio"
import webpush, { PushSubscription } from "web-push"

// // Initialize Twilio client
// const twilioClient = twilio(
// 	process.env.TWILIO_ACCOUNT_SID,
// 	process.env.TWILIO_AUTH_TOKEN
// )

// MARK: WEB PUSH
webpush.setVapidDetails(
	`mailto:${process.env.WEB_PUSH_EMAIL}`,
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
)

export async function sendSMS(to: string, body: string) {
	try {
		// await twilioClient.messages.create({
		// 	body,
		// 	from: process.env.TWILIO_PHONE_NUMBER,
		// 	to
		// })
	} catch (error) {
		console.error("Error sending SMS:", error)
	}
}

export async function sendInAppNotification(
	userId: string,
	notification: Notification
) {
	// Add Pusher trigger for in-app notification
	await pusherServer.trigger(`user-${userId}`, "notification", notification)
}

export async function sendWebPush(
	subscription: PushSubscription,
	payload: string
) {
	try {
		await webpush.sendNotification(subscription, payload)
	} catch (error) {
		console.error("Error sending Web Push notification:", error)
	}
}

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODE_MAILER_USER, // Your Gmail address
		pass: process.env.NODE_MAILER_PASSWORD // Your App Password
	}
})

export async function sendEmail(
	to: string,
	subject: string,
	emailComponent: React.ReactElement
) {
	try {
		const html = await render(emailComponent)
		// await sendGrid.send({
		//   to,
		//   from: 'noreply@farmpreneur.com',
		//   subject,
		//   html,
		// })

		const mailOptions: MailOptions = {
			from: "no-reply@farmpremneur@gmail.com",
			to,
			subject,
			html
		}

		try {
			await transporter.sendMail(mailOptions)
		} catch (error) {
			console.error("Error sending email:", error)
			throw error // Optionally re-throw to handle it further up
		}
		console.log(`Email sent to ${to} with subject: ${subject}`)
	} catch (error) {
		console.error("Error sending email:", error)
	}
}

export async function sendNotification(
	userId: string,
	notificationType: NotificationType,
	notification: {
		email: {
			subject: string
			component: React.ReactElement
		}
		sms: string
		push: {
			title: string
			body: string
			icon: string
			url: string
		}
	}
) {
	const user = await db.user.findUnique({
		where: { id: userId },
		include: {
			notificationPreferences: true,
			pushSubscription: true,
			farmer: true,
			customer: true
		}
	})

	if (!user) {
		throw new Error("User not found")
	}

	const contactNumber =
		user.farmer?.contactNumber || user.customer?.contactNumber

	if (user.notificationPreferences?.email && !isDevelopment) {
		await sendEmail(
			user.email,
			notification.email.subject,
			notification.email.component
		)
		await createNotificationLog(userId, "email", notificationType, "success")
	}

	if (user.notificationPreferences?.sms && contactNumber && !isDevelopment) {
		await sendSMS(contactNumber, notification.sms)
		await createNotificationLog(userId, "sms", notificationType, "success")
	}

	if (user.notificationPreferences?.push && user.pushSubscription.length > 0) {
		await Promise.all(
			user.pushSubscription.map(async (subscription) => {
				const pushSubscription = {
					endpoint: subscription.endpoint,
					expirationTime: null,
					keys: {
						p256dh: subscription.p256dh,
						auth: subscription.auth
					}
				}
				await sendWebPush(pushSubscription, JSON.stringify(notification.push))
			})
		)
		await createNotificationLog(userId, "push", notificationType, "success")
	}

	const createdInAppNotification = await db.notification.create({
		data: {
			title: notification.push.title,
			message: notification.push.body,
			type: notificationType,
			userId: user.id,
			metadata: { url: notification.push.url }
		}
	})

	if (user.notificationPreferences?.inApp && !isDevelopment) {
		// Create in-app notification
		await sendInAppNotification(userId, createdInAppNotification)
	}
}

async function createNotificationLog(
	userId: string,
	type: string,
	event: string,
	status: string
) {
	await db.notificationLog.create({
		data: {
			userId,
			type,
			event,
			message: `${type.toUpperCase()} notification sent for event: ${event}`,
			status
		}
	})
}
