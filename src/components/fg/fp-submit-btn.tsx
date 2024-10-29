import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"

interface FGSubmitBtnProps {
	disabled: boolean
	text: string
	isLoading?: boolean
	type?: "submit" | "button"
}

export const FGSubmitBtn = ({
	disabled,
	text,
	isLoading
}: FGSubmitBtnProps) => {
	return (
		<Button className="w-full" disabled={disabled}>
			{isLoading ? <Loader2 className="animate-spin" /> : text}
		</Button>
	)
}
