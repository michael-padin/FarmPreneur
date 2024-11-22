// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com"
			},
			{
				protocol: "https",
				hostname: "pub-c0b0612ac60c481aa03192161bd30b3f.r2.dev"
			}
		]
	}
}

export default nextConfig
