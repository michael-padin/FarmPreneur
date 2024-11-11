"use client"
import { Button } from "@/components/ui/button"
import { FormControl } from "@/components/ui/form"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { FPCalendar } from "./fp-calendar"
import { FPMonthDropdown, FPYearDropdown } from "./fp-month-year-dropdown"

interface DatePickerWithDropdownProps {
	value: Date
	onChange?: (date: Date) => void
}
export function FPDatePickerWithDropdown({
	value,
	onChange
}: DatePickerWithDropdownProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						className={cn(
							"w-full justify-start text-left font-normal",
							!value && "text-muted-foreground"
						)}
						aria-labelledby="datepicker-month-year-dropdown-v9"
					>
						<CalendarIcon className="mr-2 size-4" />
						{value ? format(value, "PPP") : <span>Pick a date</span>}
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<FPCalendar
					mode="single"
					captionLayout="dropdown"
					selected={value}
					onSelect={(date) => date && onChange?.(date)}
					showOutsideDays={true}
					endMonth={new Date(2099, 11)}
					components={{
						MonthsDropdown: FPMonthDropdown,
						YearsDropdown: FPYearDropdown,
						Chevron: ({ orientation }) =>
							orientation === "left" ? (
								<ChevronLeft className="size-4" />
							) : (
								<ChevronRight className="size-4" />
							)
					}}
					hideNavigation
				/>
			</PopoverContent>
		</Popover>
	)
}
