import { FormControl } from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

interface FGSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
	listOptions: {
		label: string
		value: string
		metadata?: string
		description?: string
	}[]
	value?: string
	onChange: (value: string) => void
	placeholder: string
}

export const FGSelect = ({
	onChange,
	value,
	listOptions,
	placeholder,
	...props
}: FGSelectProps) => {
	return (
		<Select onValueChange={onChange} defaultValue={value} {...props}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder={`Select ${placeholder}`} />
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
