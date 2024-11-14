import { UNITS_MAP } from "@/constants/unit"
import { FormControl, FormLabel } from "../ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select"

interface FPUnitSelectProps {
	onChange: (value: string) => void
	value: string
}
export const FPUnitSelect = ({ onChange, value }: FPUnitSelectProps) => (
	<>
		<FormLabel>Unit</FormLabel>
		<Select onValueChange={onChange} defaultValue={value}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder="Select unit" />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{Object.entries(UNITS_MAP).map(([key, { name, abbreviation }]) => (
					<SelectItem key={key} value={key}>
						{name} ({abbreviation})
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</>
)
