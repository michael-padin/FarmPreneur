import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TestSessionServerPage() {
	const session = await auth()
	return (
		<Card>
			<CardHeader>
				<CardTitle>Session Server Page/Component</CardTitle>
			</CardHeader>
			<CardContent>
				<pre>{JSON.stringify(session, null, 2)}</pre>
			</CardContent>
		</Card>
	)
}
