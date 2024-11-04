import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"

interface FGSubmitBtnProps extends React.ComponentProps<typeof Button> {
	text: string
	isLoading?: boolean
}

export const FGSubmitBtn = ({
	text,
	isLoading,
	...props
}: FGSubmitBtnProps) => {
	return (
		<Button {...props}>
			{isLoading ? <Loader2 className="animate-spin" /> : text}
		</Button>
	)
}
