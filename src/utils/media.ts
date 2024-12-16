import { deleteMedia, uploadMedia } from "@/lib/actions"

export interface MediaFile {
	id: string
	url?: string // Optional, for files already uploaded
	file?: File | null // Optional, for files to be uploaded
	type: "image" | "video"
}

export const processMediaUpdate = async ({
	currentFiles,
	newFiles,
	userId,
	path
}: {
	currentFiles: MediaFile[] | MediaFile | null
	newFiles: MediaFile[] | MediaFile | null
	userId: string
	path: string
}) => {
	// Ensure `currentFiles` and `newFiles` are arrays, defaulting to empty arrays if null
	const currentFileArray: MediaFile[] = Array.isArray(currentFiles)
		? currentFiles
		: currentFiles
			? [currentFiles]
			: []
	const newFileArray: MediaFile[] = Array.isArray(newFiles)
		? newFiles
		: newFiles
			? [newFiles]
			: []

	// Skip processing if both arrays are empty
	if (currentFileArray.length === 0 && newFileArray.length === 0) {
		return [] // No updates to process
	}

	// Skip processing if both arrays are identical (no changes)
	const noChanges =
		currentFileArray.length === newFileArray.length &&
		currentFileArray.every((currentFile) =>
			newFileArray.some(
				(newFile) =>
					newFile.id === currentFile.id && newFile.url === currentFile.url
			)
		)

	if (noChanges) {
		return currentFileArray // No updates needed, return existing files
	}

	// Files to delete: present in current but removed or replaced in new
	const filesToDelete = currentFileArray.filter((currentFile) => {
		const matchingNewFile = newFileArray.find(
			(newFile) => newFile.id === currentFile.id
		)
		return (
			!matchingNewFile || // File has been removed
			(matchingNewFile.file && matchingNewFile.file !== currentFile.file) // File has been replaced
		)
	})

	// Files to upload: new files with a file object
	const filesToUpload = newFileArray.filter((newFile) => newFile.file)

	// Perform all deletions and uploads concurrently
	const [uploadedFiles] = await Promise.all([
		// Upload new files
		Promise.all(
			filesToUpload.map(async (file) => {
				const uploadedUrl = await uploadMedia({
					userId,
					file: file.file!, // File is guaranteed to exist at this point
					path
				})
				return { ...file, url: uploadedUrl } // Include the uploaded URL
			})
		),

		// Delete removed/replaced files
		Promise.all(
			filesToDelete.map(async (file) => {
				if (file.url) {
					await deleteMedia(file.url) // Handle the deletion
				}
			})
		)
	])

	// Combine existing and newly uploaded files
	const existingFiles = newFileArray.filter((file) => file.url && !file.file) // Keep unchanged files
	return [...existingFiles, ...uploadedFiles]
}
