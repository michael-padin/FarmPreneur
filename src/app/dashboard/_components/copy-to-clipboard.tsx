import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

const CopyToClipboard = ({ value }: { value: string }) => {
	const [isCopied, setIsCopied] = useState(false)

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(value)
		setIsCopied(true)
		setTimeout(() => setIsCopied(false), 2000)
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-5 w-5 p-0"
						onClick={copyToClipboard}
					>
						{isCopied ? (
							<Check className="h-4 w-4 text-green-500" />
						) : (
							<Copy className="h-4 w-4" />
						)}
						<span className="sr-only">Copy ID</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{isCopied ? "Copied!" : "Copy ID"}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default CopyToClipboard
