import { db } from "@/lib/db"
import { EmailOtp } from "@prisma/client"

export async function getEmailOtpById(id: string) {
	try {
		return await db.emailOtp.findUnique({
			where: { id }
		})
	} catch (error) {
		console.error("Error in getEmailOtpById:", error)
		throw error
	}
}

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

export async function updateEmailOtp(data: EmailOtp & { id: string }) {
	try {
		const { id, ...updateData } = data
		return await db.emailOtp.update({
			where: { id },
			data: updateData
		})
	} catch (error) {
		console.error("Error in updateEmailOtp:", error)
		throw error
	}
}

export async function deleteEmailOtpById(id: string) {
	try {
		return await db.emailOtp.delete({
			where: { id }
		})
	} catch (error) {
		console.error("Error in deleteEmailOtpById:", error)
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

export async function getEmailOtpByUserId(userId: string) {
	try {
		return await db.emailOtp.findFirst({
			where: { userId }
		})
	} catch (error) {
		console.error("Error in getEmailOtpByUserId:", error)
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

export async function deleteEmailOtpByUserId(userId: string) {
	try {
		return await db.emailOtp.deleteMany({
			where: { userId }
		})
	} catch (error) {
		console.error("Error in deleteEmailOtpByUserId:", error)
		throw error
	}
}

// Additional utility functions that might be useful

export async function getValidEmailOtp(email: string, userId: string) {
	try {
		return await db.emailOtp.findFirst({
			where: {
				email,
				userId,
				expiresAt: {
					gt: new Date() // Only return non-expired OTPs
				}
			}
		})
	} catch (error) {
		console.error("Error in getValidEmailOtp:", error)
		throw error
	}
}

export async function deleteExpiredEmailOtps() {
	try {
		return await db.emailOtp.deleteMany({
			where: {
				expiresAt: {
					lt: new Date() // Delete all expired OTPs
				}
			}
		})
	} catch (error) {
		console.error("Error in deleteExpiredEmailOtps:", error)
		throw error
	}
}

export async function updateEmailOtpExpiration(
	id: string,
	newExpirationDate: Date
) {
	try {
		return await db.emailOtp.update({
			where: { id },
			data: {
				expiresAt: newExpirationDate
			}
		})
	} catch (error) {
		console.error("Error in updateEmailOtpExpiration:", error)
		throw error
	}
}

export async function countActiveOtpsByUserId(userId: string) {
	try {
		return await db.emailOtp.count({
			where: {
				userId,
				expiresAt: {
					gt: new Date()
				}
			}
		})
	} catch (error) {
		console.error("Error in countActiveOtpsByUserId:", error)
		throw error
	}
}
