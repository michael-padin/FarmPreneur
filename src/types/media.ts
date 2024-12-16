export interface MediaFile {
	id: string
	file: File | null
	url: string
	type: "image" | "video"
}
