import slugify from "slugify"
import { customAlphabet } from "nanoid"

const nanoid = customAlphabet("1234567890abcdef", 10)

export function generateSlug(text: string): string {
	const baseSlug = slugify(text, {
		replacement: "-",
		remove: /[*+~.()'"!:@]/g,
		lower: true,
		strict: true,
		locale: "en",
		trim: true
	})

	return `${baseSlug}-${nanoid()}`
}
