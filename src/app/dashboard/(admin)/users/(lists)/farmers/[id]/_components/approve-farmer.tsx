import { approveFarmer } from "@/app/actions/farmer"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export function ApproveFarmer({ farmerId }: { farmerId: string }) {
	const [state, formAction, isPending] = useActionState(approveFarmer, null)

	const formActionsWithData = formAction.bind(null, farmerId)

	useEffect(() => {
		if (state) {
			if (state.error) {
				toast.error(state.error, {
					closeButton: true,
					duration: 2000
				})
			} else {
				toast.success("Farmer approved successfully", {
					closeButton: true,
					duration: 2000
				})
			}
		}
	}, [state])

	return (
		<form action={formActionsWithData}>
			<Button variant="default" size="lg" disabled={isPending}>
				{isPending ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Check className="mr-2 h-4 w-4" />
				)}
				{!isPending && "Approve"}
			</Button>
		</form>
	)
}
