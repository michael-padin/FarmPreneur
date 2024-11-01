type Params = Promise<{ id: string }>

export default async function Page(props: { params: Params }) {
	const params = await props.params

	/**
	 * @todo - get product detail
	 */
	return <div></div>
}
