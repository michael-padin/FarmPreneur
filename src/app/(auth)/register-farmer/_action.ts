"use server"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/services/user"

import { RegisterFarmerSchema, RegisterFarmerType } from "./_types"

export const registerFarmer = async (data: RegisterFarmerType) => {
	const parsedData = RegisterFarmerSchema.safeParse(data)

	if (!parsedData.success) {
		return { error: "Invalid fields" }
	}

	const {
		email,
		contactNumber,
		description,
		location,
		images,
		userId,
		name,
		products
	} = parsedData.data

	const existingUser = await getUserByEmail(email)

	if (!existingUser) return { error: "Basic user information is missing" }

	await db.user.update({
		data: {
			role: "FARMER",
			contactNumber: contactNumber,
			farm: {
				create: {
					name: name,
					description: description,
					location: location,
					yearsOfExperience: 20,
					images: images,
					products: products.split(",") || []
				}
			}
		},
		where: {
			id: userId
		}
	})

	/**
	 * @todo Send email to user
	 */

	return { success: "User created" }
}

// export const sigInWithGoogle = async () => await signIn("google");
