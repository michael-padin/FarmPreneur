import { db } from "@/lib/db"

export async function createEmailOtp(data: {
	userId: string
	otp: string
	expiresAt: Date
	email: string
}) {
	try {
		return await db.emailOtp.create({
			data: {
				userId: data.userId,
				email: data.email,
				otp: data.otp,
				expiresAt: data.expiresAt
			},
			select: {
				expiresAt: true
			}
		})
	} catch (error) {
		console.error("Error in createEmailOtp:", error)
		throw error
	}
}

export async function getEmailOtpByEmail(email: string) {
	try {
		return await db.emailOtp.findFirst({
			where: { email }
		})
	} catch (error) {
		console.error("Error in getEmailOtpByEmail:", error)
		throw error
	}
}

export async function deleteEmailOtpByEmail(email: string) {
	try {
		return await db.emailOtp.deleteMany({
			where: { email }
		})
	} catch (error) {
		console.error("Error in deleteEmailOtpByEmail:", error)
		throw error
	}
}

export async function getEmailOtpExpirationByUserId(userId: string) {
	try {
		return await db.emailOtp.findFirst({
			where: { userId },
			select: {
				expiresAt: true
			}
		})
	} catch (error) {
		console.error("Error in getEmailOtpByUserId:", error)
		throw error
	}
}
