import { FPMediaUploader } from "@/components/fp/fp-media-uploader"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { showErrorToast } from "@/lib/handle-error"
import { processMediaUpdate } from "@/utils/media"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createCategoryAction } from "../actions"
import { createCategorySchema, CreateCategorySchema } from "../validation"

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
				url: ""
			}
		}
	})

	const onSubmit = (data: CreateCategorySchema) => {
		startTransition(async () => {
			const finalCategoryImage = await processMediaUpdate({
				currentFiles: [],
				newFiles: data.image,
				path: "categories"
			})
			const { error } = await createCategoryAction({
				...data,
				image: finalCategoryImage[0]
			})

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
				<fieldset className="space-y-4" disabled={isPending}>
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
									<FPMediaUploader {...field} initialMedia={[]} singleImage />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						disabled={isPending || !form.formState.isDirty}
						className="w-full"
					>
						{isPending ? <Loader2 className="animate-spin" /> : "Create"}
					</Button>{" "}
				</fieldset>
			</form>
		</Form>
	)
}
