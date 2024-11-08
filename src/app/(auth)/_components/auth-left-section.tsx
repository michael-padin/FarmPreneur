import { ScrollArea } from "@/components/ui/scroll-area"
import { AuthLogo } from "./auth-logo"

export const AuthLeftSection = ({ children }: React.PropsWithChildren) => (
	<ScrollArea>
		<div className="relative flex flex-col items-center justify-center p-2 py-4 pb-10 lg:m-4">
			<AuthLogo />
			<div className="w-full md:min-w-[453.6px] lg:max-w-[453.6px]">
				{children}
			</div>
		</div>
	</ScrollArea>
)
