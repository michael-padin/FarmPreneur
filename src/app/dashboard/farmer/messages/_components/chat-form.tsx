"use client "
import { sendMessage } from "@/app/actions/message"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { showErrorToast } from "@/lib/handle-error"
import { processMediaUpdate } from "@/utils/media"
import { MediaFile, mediaFileSchema } from "@/validations/media"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon, Loader2, SendIcon, X } from "lucide-react"
import Image from "next/image"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const chatSchema = z.object({
	content: z.string().min(1, "Required"),
	file: mediaFileSchema.optional().nullable()
})

type ChatSchema = z.infer<typeof chatSchema>

interface ChatFormProps {
	senderId: string
	receiverId: string
	receiverRole: string
	replyToId?: string | null
	senderRole: string
}
export function ChatForm({
	senderId,
	replyToId,
	receiverId,
	receiverRole,
	senderRole
}: ChatFormProps) {
	const [isPending, startTransition] = useTransition()
	const form = useForm<ChatSchema>({
		resolver: zodResolver(chatSchema),
		defaultValues: {
			content: "",
			file: null
		}
	})

	const file = form.watch("file")

	const onSubmit = (data: ChatSchema) => {
		startTransition(async () => {
			const finalFile = await processMediaUpdate({
				currentFiles: null,
				newFiles: data.file ? [data.file] : [],
				userId: senderId,
				path: "chat-messages"
			})

			const { error } = await sendMessage({
				content: data.content,
				fileUrl: finalFile?.[0]?.url,
				senderId,
				...(data.file && { fileType: data.file.type }),
				receiverId,
				receiverRole,
				senderRole,
				replyToId: replyToId ? replyToId : null,
				replyTo: replyToId
			})
			// const { error } = await createCustomerAddress(values)
			if (error) {
				showErrorToast(error)
			}

			form.reset()
		})
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const newMediaFile = {
				id: Date.now().toString(),
				file: file,
				url: URL.createObjectURL(file),
				type: file.type.startsWith("image/")
					? "image"
					: ("video" as MediaFile["type"])
			}
			form.setValue("file", newMediaFile)
		}
	}
	const removeMedia = () => {
		if (file?.url) {
			URL.revokeObjectURL(file.url)
		}
		form.setValue("file", null)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="bg-background px-3 py-4" disabled={isPending}>
					{file && (
						<div className="relative mb-2 h-20 w-20">
							{file.type === "image" ? (
								<div className="relative h-24 w-full">
									<Image
										src={file.url}
										alt="Preview"
										fill
										className="h-full w-full rounded-md object-contain"
									/>
								</div>
							) : (
								<video
									src={file.url}
									className="h-full w-full rounded-md object-cover"
								/>
							)}
							<Button
								type="button"
								onClick={removeMedia}
								variant="destructive"
								size="icon"
								className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					)}
					<div className="flex w-full items-center gap-3 bg-background">
						<FormField
							control={form.control}
							name="file"
							render={() => (
								<FormItem>
									<FormControl>
										<label className="cursor-pointer">
											<Input
												type="file"
												accept="image/*,video/*"
												onChange={handleFileChange}
												className="hidden"
											/>

											<ImageIcon className="h-5 w-5 text-muted-foreground" />
										</label>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											{...field}
											type="text"
											placeholder="Type a message..."
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="">
							<Button type="submit" size={"icon"}>
								{isPending ? (
									<Loader2 className="animate-spin" />
								) : (
									<SendIcon className="" />
								)}
							</Button>
						</div>
					</div>
				</fieldset>
			</form>
		</Form>
	)
}
