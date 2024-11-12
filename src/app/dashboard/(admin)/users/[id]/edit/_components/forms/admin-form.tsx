"use client"

import { getUserByIdUseCase } from "@/use-cases/users"
import { useRouter } from "next/navigation"
import { editUserSchema, EditUserSchema } from "../validations"
import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateAdmin } from "../../actions"
import { showErrorToast } from "@/lib/handle-error"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import UserFormItems from "./user-form-items"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

interface AdminFormProps {
	user: Awaited<ReturnType<typeof getUserByIdUseCase>>
}

export default function AdminForm({ user }: AdminFormProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const form = useForm<EditUserSchema>({
		resolver: zodResolver(editUserSchema),
		defaultValues: {
			role: user?.role || "CUSTOMER",
			email: user?.email || "",
			name: user?.name || "",
			password: "",
			isEmailVerified: user?.isEmailVerified || false,
			farmer: null
		}
	})

	const onSubmit = async (data: EditUserSchema) => {
		startTransition(async () => {
			const { error } = await updateAdmin({
				...data,
				userId: user!.id
			})

			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Admin updated successfully!")
			router.refresh()
			router.push("/dashboard/users")
		})
	}
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="mt-5 space-y-2">
						<Card>
							<CardHeader>
								<CardTitle>Edit Admin</CardTitle>
								<CardDescription>Edit admin details</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<UserFormItems form={form} />
								{process.env.NODE_ENV === "development" && (
									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<AccordionTrigger>User Info</AccordionTrigger>
											<AccordionContent>
												<pre>{JSON.stringify(user, null, 2)}</pre>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								)}
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									type="button"
									variant={"secondary"}
									size={"lg"}
									onClick={() => router.back()}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={!form.formState.isDirty}
									size={"lg"}
								>
									{isPending ? "Saving..." : "Save"}
								</Button>
							</CardFooter>
						</Card>
					</div>
				</form>
			</Form>
		</>
	)
}
