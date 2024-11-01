type Params = Promise<{ id: string }>

export default async function Page(props: { params: Params }) {
	const params = await props.params

	/**
	 * @todo - get product details
	 */
	return <div></div>
}
