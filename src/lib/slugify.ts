import slugify from "slugify"

export const NANOID_LENGTH = 6
export const INITIAL_MAX_ITERATIONS = 1000

export function generateSlug(text: string): string {
	const baseSlug = slugify(text, {
		replacement: "-",
		remove: /[*+~.()'"!:@]/g,
		lower: true,
		strict: true,
		locale: "en",
		trim: true
	})

	return baseSlug
}
