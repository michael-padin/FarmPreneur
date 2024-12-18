import { FormControl } from "../ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select"

interface FPSelectProps {
	onChange: (value: string) => void
	value: string
	placeholder?: string
	items: {
		value: string
		label: string
	}[]
}
export const FPSelect = ({
	onChange,
	value,
	placeholder,
	items
}: FPSelectProps) => (
	<>
		<Select onValueChange={onChange} defaultValue={value}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder={`${placeholder}`} />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{items?.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</>
)
