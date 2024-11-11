"use client"

import { getUserByIdUseCase } from "@/use-cases/users"

interface AdminFormProps {
	user: Awaited<ReturnType<typeof getUserByIdUseCase>>
}

export default function AdminForm({ user }: AdminFormProps) {
	return (
		<>
			Admin <pre>{JSON.stringify(user, null, 2)}</pre>
		</>
	)
}
