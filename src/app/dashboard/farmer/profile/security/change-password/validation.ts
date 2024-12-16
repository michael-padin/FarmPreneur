import { z } from "zod"

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "required"),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long"),
		confirmNewPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match",
		path: ["confirmNewPassword"]
	})

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
