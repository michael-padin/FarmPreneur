import { UseFormReturn } from "react-hook-form"
import { EditUserSchema } from "../validations"
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { ROLE } from "@prisma/client"
import { RoleBadge } from "../../../../(lists)/_components/badges"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface UserFormItemsProps {
	form: UseFormReturn<EditUserSchema>
}

export default function UserFormItems({ form }: UserFormItemsProps) {
	return (
		<>
			<FormField
				control={form.control}
				name="role"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Role</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a role">
										{field.value && <RoleBadge role={field.value as ROLE} />}
									</SelectValue>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{Object.values(ROLE).map((role) => (
									<SelectItem key={role} value={role}>
										<div className="flex w-full items-center justify-between">
											<RoleBadge role={role} />
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input placeholder="John Doe" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="email"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input placeholder="john@example.com" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="isEmailVerified"
				render={({ field }) => (
					<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<FormLabel>Email Verified</FormLabel>
							<FormDescription>
								Indicate if this email has been verified.
							</FormDescription>
						</div>
						<FormControl>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
					</FormItem>
				)}
			/>
		</>
	)
}
