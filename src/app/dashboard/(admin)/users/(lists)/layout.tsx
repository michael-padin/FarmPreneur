import { UsersNav } from "./_components/users-nav"

const AdminUsersLayout = async ({
	children
}: {
	children: React.ReactNode
}) => {
	return (
		<div className="px-1 py-5 lg:p-5">
			<UsersNav />
			<div className="px-2 lg:px-0">{children}</div>
		</div>
	)
}
export default AdminUsersLayout
