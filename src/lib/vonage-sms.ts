import { Auth } from "@vonage/auth"
import { SMS } from "@vonage/sms"

const credentials = new Auth({
	apiKey: process.env.VONAGE_API_KEY,
	apiSecret: process.env.VONAGE_SECRET
})
const options = {}

export const vonageSmsClient = new SMS(credentials, options)
