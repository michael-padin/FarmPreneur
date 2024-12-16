import { auth } from "@/auth"
import { db } from "@/lib/db"
import EditCustomerProfileForm from "./edit-profile-form"

const getFarmerProfile = async (id?: string) => {
	const profile = await db.farmer.findUnique({
		where: { id },
		select: {
			farmName: true,
			gender: true,
			farmDescription: true,
			coverPhoto: true,
			profilePicture: true,
			contactNumber: true,
			birthDate: true,
			user: {
				select: {
					id: true,
					email: true
				}
			}
		}
	})

	return {
		userId: profile?.user.id || "",
		email: profile?.user.email || "",
		birthDate: profile?.birthDate || "",
		contactNumber: profile?.contactNumber || "",
		farmName: profile?.farmName || "",
		gender: profile?.gender || "",
		farmDescription: profile?.farmDescription || "",
		coverPhoto: profile?.coverPhoto
			? {
					id: Math.random().toString(36).substring(7),
					url: profile?.coverPhoto || "",
					type: "image" as "image" | "video",
					file: null
				}
			: null,
		profilePicture: profile?.profilePicture
			? {
					id: Math.random().toString(36).substring(7),
					url: profile?.profilePicture || "",
					type: "image" as "image" | "video",
					file: null
				}
			: null
	}
}

export async function FormWrapper() {
	const farmerId = (await auth())?.user.farmerId
	const farmerProfile = await getFarmerProfile(farmerId)
	return (
		<>
			<EditCustomerProfileForm farmerProfile={farmerProfile} />
		</>
	)
}
