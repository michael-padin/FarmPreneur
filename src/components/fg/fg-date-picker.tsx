import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React from "react"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { FormControl } from "../ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type FGDatePickerProps = {
  value?: Date
  onChange: (value: Date) => void
}

export const FGDatePicker = ({ value, onChange }: FGDatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(value) => value && onChange(value)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
