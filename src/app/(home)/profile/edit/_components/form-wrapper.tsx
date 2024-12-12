import { getCustomerProfileUseCase } from "@/use-cases/customers"
import EditCustomerProfileForm from "./edit-profile-form"

export async function FormWrapper() {
	const customerProfile = await getCustomerProfileUseCase()
	return (
		<>
			<EditCustomerProfileForm customerProfile={customerProfile} />
		</>
	)
}
