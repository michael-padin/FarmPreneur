import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface NavLinkProps {
	href: string
	count: number
	Icon: LucideIcon
	navButtonClasses: string
	badgeClasses: string
}

export function NavLink({
	href,
	count,
	Icon,
	navButtonClasses,
	badgeClasses
}: NavLinkProps) {
	return (
		<Link
			href={href}
			className="cursor-pointer hover:bg-transparent hover:text-current"
		>
			<div className={`${navButtonClasses} relative`}>
				<Icon className="h-6 w-6" />
				{count > 0 && <span className={badgeClasses}>{count}</span>}
			</div>
		</Link>
	)
}
