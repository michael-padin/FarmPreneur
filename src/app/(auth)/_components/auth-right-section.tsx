import Image, { ImageProps } from "next/image"
interface AuthLeftSectionProps {
	imageProps: ImageProps
}
export const AuthRightSection = ({ imageProps }: AuthLeftSectionProps) => (
	<div className="relative my-4 hidden flex-col rounded-lg bg-muted dark:border-r lg:flex lg:flex-1">
		<div className="absolute inset-0">
			<Image {...imageProps} alt={imageProps.alt} objectFit="contain" fill />
		</div>

		{/* <div className="relative z-20 mt-auto">
			<blockquote className="space-y-2">
				<p className="text-lg">
					&ldquo;This library has saved me countless hours of work and helped me
					deliver stunning designs to my clients faster than ever before.&rdquo;
				</p>
				<footer className="text-sm">Sofia Davis</footer>
			</blockquote>
		</div> */}
	</div>
)
