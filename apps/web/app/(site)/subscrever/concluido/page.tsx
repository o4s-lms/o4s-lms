"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { enqueueSnackbar } from "notistack"
import { OrdersIdResponseData } from "@o4s/generated-wundergraph/models"
import { Icons } from "@/components/icons"
import { useEffectOnce } from "usehooks-ts"
import useCreateOrderMutation from "@/hooks/orders/use-create-order-mutation"

type Order = OrdersIdResponseData["order"]

export default function SubscricaoConcluida() {
	const createOrder = useCreateOrderMutation()
	const stepsItems = ["Carrinho", "Pagamento", "Identificação", "Conclusão"]
	const [currentStep, setCurrentStep] = React.useState<number>(4)
	const [order, setOrder] = React.useState<Order>()
	const searchParams = useSearchParams()
  const cartId = searchParams.get("cartId")
	const paymentMethod = searchParams.get("paymentMethod")

	useEffectOnce(() => {
    async function fetchOrder() {
			if (cartId && paymentMethod) {
				const data = await createOrder.trigger({ cart_id: cartId, payment_method: paymentMethod })
				if (!ignore) {
					setOrder(data?.order)
				}
			}
		}
		let ignore = false
		fetchOrder()
		return () => {
      ignore = true
    }
  })

  return (
		<>
			<section className="bg-gray-50 py-4 dark:bg-gray-900">
				<div className="mx-auto max-w-2xl px-4 md:px-0">
					<ul aria-label="Steps" className="items-center font-medium text-gray-600 dark:text-gray-300 md:flex">
						{stepsItems.map((item, idx) => (
							<li key={idx} aria-current={currentStep == idx + 1 ? "step" : false} className="flex flex-1 gap-x-2 last:flex-none md:items-center">
								<div className="flex flex-col items-center gap-x-2">
									<div className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 ${currentStep > idx + 1 ? "border-indigo-600 bg-indigo-600" : "" || currentStep == idx + 1 ? "border-indigo-600" : ""}`}>
										<span className={`${currentStep > idx + 1 ? "hidden" : "" || currentStep == idx + 1 ? "text-indigo-600" : ""}`}>
											{idx + 1}
										</span>
										{currentStep > idx + 1 ? (
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-white">
												<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
											</svg>
										) : ""}
									</div>
									<hr className={`h-12 border md:hidden ${idx + 1 == stepsItems.length ? "hidden" : "" || currentStep > idx + 1 ? "border-indigo-600" : ""}`} />
								</div>
								<div className="flex h-8 items-center md:h-auto">
									<h3 className={`text-sm ${currentStep == idx + 1 ? "text-indigo-600" : ""}`}>
										{item}
									</h3>
								</div>
								<hr className={`mr-2 hidden w-full border md:block ${idx + 1 == stepsItems.length ? "hidden" : "" || currentStep > idx + 1 ? "border-indigo-600" : ""}`} />
							</li>
						))}
					</ul>
				</div>
			
				<div className={`${currentStep == 4 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
					{order ? (
						<div>
							<p>{JSON.stringify(order, null, 2)}</p>
						</div>
					) : (
						<div>
							<p>Estamos processando o seu pedido... Aguarde um momento <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /></p>
						</div>
					)}
				</div>
			</section>
		</>
  )
}