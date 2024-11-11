"use client"
import React from "react"
import { DropdownProps } from "react-day-picker"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { FormControl } from "../../ui/form"

export function FPYearDropdown({
	value,
	onChange,
	name,
	options,
	"aria-label": ariaLabel
}: DropdownProps) {
	const handleChange = (value: string) => {
		const changeEvent = {
			target: {
				value
			}
		} as React.ChangeEvent<HTMLSelectElement>
		onChange?.(changeEvent)
	}

	return (
		<Select value={value?.toString()} onValueChange={handleChange}>
			<FormControl>
				<SelectTrigger name={name} aria-label={ariaLabel}>
					<SelectValue className="w-[100px]" />
				</SelectTrigger>
			</FormControl>
			<SelectContent className="w-full">
				{options?.map((option, childIdx: number) => (
					<SelectItem
						key={`${option.value}-${childIdx}`}
						value={option.value?.toString() ?? ""}
					>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export function FPMonthDropdown({
	value,
	onChange,
	name,
	options,
	"aria-label": ariaLabel
}: DropdownProps) {
	const handleChange = (value: string) => {
		const changeEvent = {
			target: {
				value
			}
		} as React.ChangeEvent<HTMLSelectElement>
		onChange?.(changeEvent)
	}

	return (
		<Select value={value?.toString()} onValueChange={handleChange}>
			<FormControl>
				<SelectTrigger name={name} aria-label={ariaLabel}>
					<SelectValue />
				</SelectTrigger>
			</FormControl>
			<SelectContent className="w-full">
				{options?.map((option, childIdx: number) => (
					<SelectItem
						key={`${option.value}-${childIdx}`}
						value={option.value?.toString() ?? ""}
					>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
