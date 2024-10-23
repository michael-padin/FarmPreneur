import { UsersNav } from "./_components/users-nav"

const AdminUsersLayout = async ({
	children
}: {
	children: React.ReactNode
}) => {
	return (
		<div className="px-1 py-5 lg:p-5">
			<UsersNav />
			<div>{children}</div>
		</div>
	)
}
export default AdminUsersLayout
