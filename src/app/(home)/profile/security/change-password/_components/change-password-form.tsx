"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"

import { FGPasswordInput } from "@/components/fg/fg-password-input"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"

import { changeUserPassword } from "@/lib/actions"
import { showErrorToast } from "@/lib/handle-error"
import { useRouter } from "next/navigation"
import { changePasswordSchema, ChangePasswordSchema } from "../validation"

const ChangePasswordForm = () => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<ChangePasswordSchema>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: ""
		}
	})

	const onSubmit = async (data: ChangePasswordSchema) => {
		startTransition(async () => {
			const { error } = await changeUserPassword(data)

			if (error) {
				showErrorToast(error)
				return
			}
			router.push("/verify-email")
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
				<fieldset disabled={isPending} className="space-y-4">
					<FormField
						control={form.control}
						name="currentPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Password</FormLabel>
								<FormControl>
									<FGPasswordInput {...field} autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<FGPasswordInput {...field} autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmNewPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm New Password</FormLabel>
								<FormControl>
									<FGPasswordInput {...field} autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? (
							<Loader2 className="animate-spin" />
						) : (
							"Change Password"
						)}
					</Button>
				</fieldset>
			</form>
		</Form>
	)
}

export default ChangePasswordForm
