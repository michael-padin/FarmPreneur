import { z } from "zod"

export const LoginSchema = z.object({
	email: z.string().min(1, "Required").email(),
	password: z.string().min(1, "Required")
})
export type LoginType = z.infer<typeof LoginSchema>
