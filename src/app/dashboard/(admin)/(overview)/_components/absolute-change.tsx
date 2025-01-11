import { ArrowDown, ArrowUp } from "lucide-react"

type ChangeType = "units" | "percent" | "currency"

export function AbsoluteChange({
	change,
	type = "units"
}: {
	change: number
	type?: ChangeType
}) {
	const renderType = () => {
		switch (type) {
			case "units":
				return null
			case "percent":
				return "%"
			case "currency":
				return "₱"
			default:
		}
	}
	return (
		<>
			{change > 0 ? (
				<p className="mt-1 flex items-center gap-1 text-sm text-primary">
					<ArrowUp className="h-5 w-5" />+{renderType()}
					{change} from last month
				</p>
			) : (
				<p className="mt-1 flex items-center gap-1 text-sm text-destructive dark:text-red-600">
					<ArrowDown className="h-5 w-5" />-{renderType()}
					{change} from last month
				</p>
			)}
		</>
	)
}
