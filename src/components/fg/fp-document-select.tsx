import { documentOptions } from "@/types/verificationDocument"
import { FormControl, FormLabel } from "../ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select"

interface FPDocumentSelectProps {
	onChange: (value: string) => void
	value: string
}
export const FPDocumentSelect = ({
	onChange,
	value
}: FPDocumentSelectProps) => (
	<>
		<FormLabel>Document Type</FormLabel>
		<Select onValueChange={onChange} defaultValue={value}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder="Select a document type" />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{documentOptions.map((doc) => (
					<SelectItem value={doc.value} key={doc.value}>
						{doc.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</>
)
