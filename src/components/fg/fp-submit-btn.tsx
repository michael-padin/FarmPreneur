import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"

interface FGSubmitBtnProps {
	disabled: boolean
	text: string
}

export const FGSubmitBtn = ({ disabled, text }: FGSubmitBtnProps) => {
	return (
		<Button type="submit" className="w-full" disabled={disabled}>
			{disabled ? <Loader2 className="animate-spin" /> : text}
		</Button>
	)
}
