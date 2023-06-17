import { Icons } from "@/components/icons"
import { useQuery } from "@o4s/generated-wundergraph/nextjs"

function PaymentMethod() {
	const { data, isLoading } = useQuery({
		operationName: 'payments/methods',
		input: {
			locale: 'pt'
		}
	})

	const radios = data?.methods

	return (
		<div className="mx-auto max-w-md px-4">
			<h2 className="font-medium text-gray-800">Select your payment method</h2>
			{isLoading ? (
				<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
			) : (
			<ul className="mt-6 space-y-3">
				{
					radios?.map((item, idx) => (
						<li key={idx}>
							<label htmlFor={item.name} className="relative block">
								<input id={item.name} type="radio" defaultChecked={idx == 1 ? true : false} name="payment" className="peer sr-only" />
								<div className="flex w-full cursor-pointer items-start gap-x-3 rounded-lg border bg-white p-4 shadow-sm ring-indigo-600 duration-200 peer-checked:ring-2">
									<div className="flex-none">
										{item.icon}
									</div>
									<div>
										<h3 className="pr-3 font-medium leading-none text-gray-800">
											{item.name}
										</h3>
										<p className="mt-1 text-sm text-gray-600">
											{item.description}
										</p>
									</div>
								</div>
								<div className="absolute right-4 top-4 flex h-4 w-4 flex-none items-center justify-center rounded-full border text-white duration-200 peer-checked:bg-indigo-600 peer-checked:text-white">
									<svg className="h-2.5 w-2.5" viewBox="0 0 12 10"><polyline fill="none" stroke-width="2px" stroke="currentColor" stroke-dasharray="16px" points="1.5 6 4.5 9 10.5 1"></polyline></svg>
								</div>
							</label>
						</li>
					))
				}
			</ul>
			)}
		</div>
	)
}

export default PaymentMethod