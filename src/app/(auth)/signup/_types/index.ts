import { z } from "zod"

export const registerSchema = z
	.object({
		firstName: z.string().min(2),
		lastName: z.string().min(2),
		email: z.string().email().min(1),
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"]
	})

export type RegisterSchema = z.infer<typeof registerSchema>
