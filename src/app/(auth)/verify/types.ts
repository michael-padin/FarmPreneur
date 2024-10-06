import { z } from "zod"

export const VerificationFormSchema = z.object({
	userId: z.string().min(1),
	code: z.string().min(6, {
		message: "Your code must be 6 characters."
	})
})

export type VerificationType = z.infer<typeof VerificationFormSchema>
