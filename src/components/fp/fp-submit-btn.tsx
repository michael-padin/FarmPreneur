import { Loader2 } from "lucide-react"

interface FGSubmitBtnProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string
	isLoading?: boolean
}

export const FPSubmitButton = ({
	text,
	isLoading,
	...props
}: FGSubmitBtnProps) => {
	return (
		<button {...props}>
			{isLoading ? <Loader2 className="animate-spin" /> : text}
		</button>
	)
}
