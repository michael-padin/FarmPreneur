import { Prisma } from "@prisma/client"
import { isRedirectError } from "next/dist/client/components/redirect"
import { toast } from "sonner"
import { z } from "zod"

export function getErrorMessage(err: unknown) {
	const unknownError = "Something went wrong, please try again later."

	if (err instanceof z.ZodError) {
		const errors = err.issues.map((issue) => {
			return issue.message
		})
		return errors.join("\n")
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		// The .code property can be accessed in a type-safe manner
		switch (err.code) {
			case "P2002":
				return "A unique constraint would be violated on this operation."
			case "P2025":
				return "Record to update not found."
			case "P2003":
				return "Foreign key constraint failed on the field."
			default:
				return `An unknown error occurred. Please try again later.`
		}
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		return "The data provided is invalid."
	} else if (err instanceof Prisma.PrismaClientRustPanicError) {
		return "A database connection error occurred. Please try again later."
	} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
		return "An unknown error occurred while processing your request."
	} else if (err instanceof Error) {
		return err.message
	} else if (isRedirectError(err)) {
		throw err
	} else if (typeof err === "string") {
		return err
	} else {
		return unknownError
	}
}

export function showErrorToast(err: unknown) {
	const errorMessage = getErrorMessage(err)
	return toast.error(errorMessage)
}
