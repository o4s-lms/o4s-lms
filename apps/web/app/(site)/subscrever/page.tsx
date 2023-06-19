"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { enqueueSnackbar } from "notistack"
import { createClient } from "@o4s/generated-wundergraph/client"
import { useUser } from "@/lib/wundergraph"
import { MoveRight, MoveLeft } from 'lucide-react'
import { ProductsAllResponseData, OrdersIdResponseData } from "@o4s/generated-wundergraph/models"
import CartTable from "../components/cart-table"
import PromosTable from "../components/promos-table"
import PaymentMethod from "../components/payment-method"
import { Icons } from "@/components/icons"
import { createCart } from "@/actions/orders"
import { useEffectOnce } from "usehooks-ts"
import { Loading } from "@/components/loading"
import useCreateOrderMutation from "@/hooks/orders/use-create-order-mutation"
import Brand from "@/components/brand"
import { removeCart } from "@/actions/orders"

type Order = OrdersIdResponseData["order"]

type Product = ProductsAllResponseData["products"][number] | undefined
type Cart = OrdersIdResponseData["order"]

const client = createClient({
  customFetch: fetch,
})

/**function getCookie(name: string) {
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        const cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function getCookie(key: string) {
	if(typeof document !== 'undefined') {
		var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
		return b ? b.pop() : "";
	}
}*/

export default function Subscrever() {
	const router = useRouter()
  const createOrder = useCreateOrderMutation()
	const stepsItems = ["Identificação", "Carrinho", "Pagamento", "Conclusão"]
	const [currentStep, setCurrentStep] = React.useState<number>(1)
	const [cartId, setCartId] = React.useState<string>()
  const [order, setOrder] = React.useState<Order>()
	const searchParams = useSearchParams()
  const productId = searchParams.get("product") || ''

  const { data: user, error, isLoading } = useUser()

	useEffectOnce(() => {
    async function fetchCart() {
			const id = await createCart(productId)
			if (!ignore) {
        setCartId(id)
      }
		}
		let ignore = false
		fetchCart()
		return () => {
      ignore = true
    }
  })

	/**React.useEffect(() => {
		async function fetchCart() {
			const id = await createCart(productId)
			if (!ignore) {
        setCartId(id)
      }
		}
		let ignore = false
		fetchCart()
		return () => {
      ignore = true
    }
  }, [productId])*/

	const save = async (method_id: string | undefined) => {
    if (cartId && method_id) {
      setCurrentStep(4)
      const data = await createOrder.trigger({ cart_id: cartId, payment_method: method_id })

      setOrder(data?.order)
      removeCart(cartId)
    }
	}

  if (isLoading) {
    return <Loading />
  }

    return (
			<><section className="bg-gray-50 py-4 dark:bg-gray-900">
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
      <div className={`${currentStep == 1 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
				{user ? (
          <>
          <button
						onClick={() => setCurrentStep(2)}
						aria-label="back-to-products"
						className="border-palette-primary text-palette-primary font-primary focus:ring-palette-light hover:bg-palette-lighter flex w-full items-center justify-center rounded-sm
					              border pb-1 pt-2 text-lg font-semibold leading-relaxed focus:outline-none focus:ring-1"
					>
						Ir para o Carrinho
            <MoveRight className="ml-2 inline-flex w-4"/>
					</button>
          </>
        ) : (
          <>
          <button
						onClick={() => router.replace(`/signin?callback=/subscrever?productId=${productId}`)}
						aria-label="back-to-products"
						className="border-palette-primary text-palette-primary font-primary focus:ring-palette-light hover:bg-palette-lighter flex w-full items-center justify-center rounded-sm
					border pb-1 pt-2 text-lg font-semibold leading-relaxed focus:outline-none focus:ring-1"
					>
						Identifique-se entrando com o seu email
					</button>
          </>
        )}
			</div>
			<div className={`${currentStep == 2 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
				{cartId ? (
					<CartTable cartId={cartId} />
				) : (
					<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
				)}

				{/**<PromosTable card={card} />*/}
				<button
					onClick={() => setCurrentStep(3)}
					aria-label="checkout-products"
					className="bg-palette-primary font-primary focus:ring-palette-light hover:bg-palette-dark flex w-full items-center justify-center rounded-sm
					pb-1 pt-2 text-lg font-semibold leading-relaxed text-white focus:outline-none focus:ring-1"
				>
					Pagamento
					<MoveRight className="ml-2 inline-flex w-4"/>
				</button>

			</div>

			<div className={`${currentStep == 3 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
				<PaymentMethod saveOrder={(method_id) => save(method_id)} />

					<button
						onClick={() => setCurrentStep(2)}
						aria-label="back-to-products"
						className="border-palette-primary text-palette-primary font-primary focus:ring-palette-light hover:bg-palette-lighter flex w-full items-center justify-center rounded-sm
					border pb-1 pt-2 text-lg font-semibold leading-relaxed focus:outline-none focus:ring-1"
					>
						<MoveLeft className="ml-2 inline-flex w-4"/>
						Voltar ao Carrinho
					</button>
			</div>
			<div className={`${currentStep == 4 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
        {order ? (
						<div className="mx-auto max-w-xl rounded-lg px-8 py-10 shadow-lg">
							<div className="mb-8 flex items-center justify-between">
									<div className="flex items-center">
											<Brand />
									</div>
									<div className="text-gray-700">
											<div className="mb-2 text-xl font-bold">SUBSCRIÇÃO</div>
											<div className="text-sm">#: {order.id}</div>
											<div className="text-sm">Data: {new Date().toLocaleDateString('pt-PT')}</div>

									</div>
							</div>
							<div className="mb-8 border-b-2 border-gray-300 pb-8">
									<h2 className="mb-4 text-2xl font-bold">Para:</h2>
									<div className="text-gray-700">{order.customer_email}</div>
							</div>
							<table className="mb-8 w-full text-left">
									<thead>
											<tr>
													<th className="py-2 font-bold uppercase text-gray-700">Curso</th>
													<th className="py-2 font-bold uppercase text-gray-700">Desconto</th>
													<th className="py-2 font-bold uppercase text-gray-700">Total</th>
											</tr>
									</thead>
									<tbody>
										{order.items?.map((item, idx) => (
											<tr key={idx}>
												<td className="py-4 text-gray-700">{item.product.title}</td>
												<td className="py-4 text-gray-700">{item.discount}</td>
												<td className="py-4 text-gray-700">{item.price}</td>
											</tr>
										))}
									</tbody>
							</table>
							<div className="mb-8 flex justify-end">
									<div className="mr-2 text-gray-700">Descontos:</div>
									<div className="text-gray-700">{order.discount_total}</div>
							</div>
							<div className="mb-8 text-right">
									<div className="mr-2 text-gray-700">Tax:</div>
									<div className="text-gray-700">{order.tax_total}</div>
							</div>
							<div className="mb-8 flex justify-end">
									<div className="mr-2 text-gray-700">Subtotal:</div>
									<div className="text-gray-700">{order.sub_total}</div>
							</div>
							<div className="mb-8 flex justify-end">
									<div className="mr-2 text-gray-700">Total:</div>
									<div className="text-xl font-bold text-gray-700">{order.sub_total_with_tax}</div>
							</div>
							<div className="mb-8 border-t-2 border-gray-300 pt-8">
									<div className="mb-2 text-gray-700">Payment is due within 30 days. Late payments are subject to fees.</div>
									<div className="mb-2 text-gray-700">Please make checks payable to Your Company Name and mail to:</div>
									<div className="text-gray-700">123 Main St., Anytown, USA 12345</div>
							</div>
						</div>
				) : (
					<div>
						<p>Estamos processando o seu pedido... Aguarde um momento <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /></p>
					</div>
				)}
			</div>
			</section></>
    )
}
