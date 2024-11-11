"use client"

import { getUserByIdUseCase } from "@/use-cases/users"

interface FarmerFormProps {
	user: Awaited<ReturnType<typeof getUserByIdUseCase>>
}

export default function FarmerForm({ user }: FarmerFormProps) {
	return (
		<>
			FarmerForm <pre>{JSON.stringify(user, null, 2)}</pre>
		</>
	)
}
