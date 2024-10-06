export const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
}

export const generateExpiration = (minutes = 10) => {
	return new Date(new Date().getTime() + minutes * 60000) // 10 minutes from now
}
