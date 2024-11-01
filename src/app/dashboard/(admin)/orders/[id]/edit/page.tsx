type Params = Promise<{ id: string }>

export default async function Page(props: { params: Params }) {
	const params = await props.params

	/**
	 * @todo - get order details,
	 * @Description - include product, users(customer, farmer)
	 */
	return <div></div>
}
