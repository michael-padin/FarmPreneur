import OpenGraphImage from "@/components/open-graph-image"

export const runtime = "edge"

export default async function Image() {
	return await OpenGraphImage()
}
