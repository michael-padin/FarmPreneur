"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function TestClientSessionPage() {
	const [newName, setNewName] = useState("")
	const { data, status, update } = useSession()
	return (
		<Card>
			<CardHeader>
				<CardTitle>Session Client Page/Component</CardTitle>
			</CardHeader>
			<CardContent className="space-y-8">
				<div className="">
					<h1>Data</h1>
					<div className="w-full overflow-x-auto rounded-lg bg-green-100 p-2">
						<pre className="">{JSON.stringify(data, null, 2)}</pre>
					</div>
				</div>
				<div>
					<h1>Status</h1>
					<pre>{status}</pre>
				</div>
				<div>
					<h1>New name of session</h1>
					<Input
						placeholder="John Doe"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
					/>
				</div>
				<Button
					onClick={() => {
						update({ ...data?.user, name: newName })
					}}
				>
					Update User Name
				</Button>
			</CardContent>
		</Card>
	)
}
