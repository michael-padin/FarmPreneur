import { z } from "zod"

export const NewPasswordFormSchema = z
	.object({
		token: z.string(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(
				/[^a-zA-Z0-9]/,
				"Password must contain at least one special character"
			),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"]
	})

export type NewPasswordFormType = z.infer<typeof NewPasswordFormSchema>
