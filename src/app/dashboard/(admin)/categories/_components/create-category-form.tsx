import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { createCategorySchema, CreateCategorySchema } from "../validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/fg/fp-s3-file-upload"
import { S3PATH } from "@/constants/s3-path"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { showErrorToast } from "@/lib/handle-error"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createCategory } from "../actions"

interface CreateCategoryFormProps {
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateCategoryForm({ setOpen }: CreateCategoryFormProps) {
	const [isPending, startTransition] = useTransition()
	const form = useForm<CreateCategorySchema>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			name: "",
			description: "",
			image: {
				url: "",
				filename: "",
				size: 0,
				mimeType: ""
			}
		}
	})

	const onSubmit = (data: CreateCategorySchema) => {
		startTransition(async () => {
			const { error } = await createCategory(data)

			if (error) {
				showErrorToast(error)
				return
			}

			toast.success("Category created successfully!")
			setOpen?.(false)
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="grid gap-4 max-sm:px-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Fruits" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea placeholder="fruits are ..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category Image</FormLabel>
								<FormControl>
									<FileUpload
										path={S3PATH.CATEGORIES}
										{...field}
										value={field.value}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isPending || !form.formState.isDirty}>
						{isPending ? <Loader2 className="animate-spin" /> : "Create"}
					</Button>{" "}
				</fieldset>
			</form>
		</Form>
	)
}
