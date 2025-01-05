"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const { theme } = useTheme()

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:!bg-background group-[.toaster]:!text-foreground group-[.toaster]:!border-border group-[.toaster]:!shadow-lg",
					description: "group-[.toast]:!text-muted-foreground",
					actionButton:
						"group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground",
					cancelButton:
						"group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground"
				}
			}}
			position={`${isDesktop ? "bottom-right" : "top-right"}`}
			{...props}
		/>
	)
}

export { Toaster }
