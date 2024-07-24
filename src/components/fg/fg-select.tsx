import { FormControl } from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

interface FGSelectProps {
	listOptions: {
		label: string
		value: string
		metadata?: string
		description?: string
	}[]
	onChange: (value: string) => void
	value?: string
	placeholder: string
	disabled?: boolean
	showTooltip?: boolean
}

export const FGSelect = ({ onChange, value, listOptions }: FGSelectProps) => {
	return (
		<Select onValueChange={onChange} value={value}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder="Select a service to submit" />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{listOptions.map((option) => (
					<SelectItem value={option.value} key={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
