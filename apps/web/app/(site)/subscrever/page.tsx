"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js"
import { client, useUser } from "@/lib/wundergraph"
import { MoveRight, MoveLeft } from 'lucide-react'
import { ProductsAllResponseData, OrdersIdResponseData } from "@o4s/generated-wundergraph/models"
import CartTable from "../components/cart-table"
import PromosTable from "../components/promos-table"
import PaymentMethod from "../components/payment-method"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { createCart } from "@/actions/orders"
import { useEffectOnce } from "usehooks-ts"
import Loading from "../components/loading"
import useCreateOrderMutation from "@/hooks/orders/use-create-order-mutation"
import Brand from "@/components/brand"
import { removeCart } from "@/actions/orders"
import { PaymentsMethodsResponseData } from "@o4s/generated-wundergraph/models"
import { sendEmail } from "@/actions/emails"

type Method = PaymentsMethodsResponseData["methods"][number]
type Order = OrdersIdResponseData["order"]

const FUNDING_SOURCES = [
  FUNDING.PAYPAL,
  FUNDING.CARD
]

const initialOptions = {
  "client-id": "AamHpFXrUnZC9_TD8dK22YPFgVzUgXR5cnAQNnHuEeHqiSKT70uOEgfyIldpCI98S3yiT0vbvpaNYJXg",
  "enable-funding": "paylater,venmo",
  "locale": "pt_PT",
  "currency": "EUR",
}

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
  const { toast } = useToast()
  const createOrder = useCreateOrderMutation()
	const stepsItems = ["Identificação", "Carrinho", "Método", "Pagar", "Conclusão"]
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

	const save = async (method: Method | undefined) => {
    if (cartId && method) {
      if (method.is_manual) {
        setCurrentStep(5)
      } else {
        setCurrentStep(4)
      }

      const data = await createOrder.trigger({ cart_id: cartId, payment_method: method.id })

      if (data?.order?.payment?.payment_method.is_manual) {
        void sendEmail(data?.order.customer_email)
      }

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
						aria-label="go-to-cart"
						className="mt-4 w-full rounded-lg bg-indigo-600 p-3 text-lg font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700"
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
						className="mt-4 w-full rounded-lg bg-indigo-600 p-3 text-sm font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700"
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
					className="mt-4 w-full rounded-lg bg-indigo-600 p-3 text-lg font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700"
				>
					Pagamento
					<MoveRight className="ml-2 inline-flex w-4"/>
				</button>

			</div>

			<div className={`${currentStep == 3 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
				<PaymentMethod saveOrder={(method) => save(method)} />

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
							<div className="text-gray-500">
								<div className="mb-2 text-xl font-bold">SUBSCRIÇÃO</div>
								<div className="text-sm">#: {order.id}</div>
								<div className="text-sm">Data: {new Date().toLocaleDateString('pt-PT')}</div>
								<div className="text-sm font-bold">Refª Pagamento: {order.payment?.id.slice(18).toUpperCase()}</div>
                <div className="text-sm font-bold">STATUS: {order.payment?.status}</div>
							</div>
						</div>
            <PayPalScriptProvider options={initialOptions}>
              {
                FUNDING_SOURCES.map(fundingSource=>{
                  return(
                    <PayPalButtons
                      fundingSource={fundingSource}
                      key={fundingSource}

                      style={{
                        layout: 'vertical',
                        shape: 'rect',
                        color: (fundingSource == FUNDING.PAYLATER) ? 'gold' : undefined,
                      }}

                      createOrder={async (data, actions) => {
                        const { data: paypal_order, error } = await client.mutate({
                          operationName: 'paypal/orders',
                          input: {
                            order_id: order.id
                          }
                        })
                        if (error) {
                          toast({
                            variant: "destructive",
                            title: "Sorry, your transaction could not be processed.",
                            description: (
                              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{error.message}</code>
                              </pre>
                            ),
                          })
                          console.error(error)
                        }

                        return paypal_order.id

                      }}

                      onApprove={async (data, actions) => {
                        const { data: details, error } = await client.mutate({
                          operationName: 'paypal/capture',
                          input: {
                            order_id: data.orderID
                          }
                        })

                        if (error) {
                          console.error(error)
                        }

                        const errorDetail = Array.isArray(details.details) && details.details[0]

                        if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                          return actions.restart();
                          // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
                        }

                        if (errorDetail) {

                          let msg = errorDetail.description ? ' ' + errorDetail.description : ''
                          msg += details.debug_id ? ' (' + details.debug_id + ')' : ''
                          toast({
                            variant: "destructive",
                            title: "Sorry, your transaction could not be processed.",
                            description: (
                              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{error.message}</code>
                              </pre>
                            ),
                          })

                        }

                        // Successful capture! For demo purposes:
                        console.log('Capture result', details, JSON.stringify(details, null, 2))
                        const transaction = details.purchase_units[0].payments.captures[0]
                        const payer = details.payer
                        toast({
                          title: "Transaction processed sucessfully.",
                          description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                              <code className="text-white">{'Transaction '+ transaction.status + ': ' + transaction.id}</code>
                            </pre>
                          ),
                        })
                        // alert('Transaction '+ transaction.status + ': ' + transaction.id + 'See console for all available details')
                        const { data: _order } = await client.mutate({
                          operationName: 'payments/paid',
                          input: {
                            order_id: order.id,
                            payment_id: order.payment?.id,
                            transaction_id: transaction.id,
                            payer_id: payer.payer_id,
                          },
                        })
                        console.log('Order', _order, JSON.stringify(_order, null, 2))
                        setOrder(_order.order)
                        setCurrentStep(5)
                      }}
                  />)
                })
              }
            </PayPalScriptProvider>
          </div>
        ) : (
					<div className="flex items-center">
						<div><p>Estamos a processar o seu pedido... Por favor aguarde um momento.</p></div>
            <div><Loading /></div>
					</div>
				)}
      </div>
			<div className={`${currentStep == 5 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
        {order ? (
						<div className="mx-auto max-w-xl rounded-lg px-8 py-10 shadow-lg">
							<div className="mb-8 flex items-center justify-between">
									<div className="flex items-center">
											<Brand />
									</div>
									<div className="text-gray-500">
											<div className="mb-2 text-xl font-bold">SUBSCRIÇÃO</div>
											<div className="text-sm">#: {order.id}</div>
											<div className="text-sm">Data: {new Date().toLocaleDateString('pt-PT')}</div>
											<div className="text-sm font-bold">Refª Pagamento: {order.payment?.id.slice(18).toUpperCase()}</div>
                      <div className="text-sm font-bold">STATUS: {order.payment?.status}</div>
                      {order.payment?.status === 'PAID' && (
                        <div className="text-sm font-bold">
                          <Link href="/app/cursos" >Aceder Cursos</Link>
                        </div>
                      )}
									</div>
							</div>
							<div className="mb-8 border-b-2 border-gray-300 pb-8">
									<h2 className="mb-4 text-2xl font-bold">Para:</h2>
									<div className="text-gray-500">{order.customer_email}</div>
							</div>
							<table className="mb-8 w-full text-left">
									<thead>
											<tr>
													<th className="py-2 font-bold uppercase text-gray-500">Curso</th>
													<th className="py-2 font-bold uppercase text-gray-500">Desconto</th>
													<th className="py-2 font-bold uppercase text-gray-500">Total</th>
											</tr>
									</thead>
									<tbody>
										{order.items?.map((item, idx) => (
											<tr key={idx}>
												<td className="py-4 text-gray-500">{item.product.title}</td>
												<td className="py-4 text-gray-500">{item.discount}</td>
												<td className="py-4 text-gray-500">{item.price}</td>
											</tr>
										))}
									</tbody>
							</table>
              {order.discount_total > 0 && (
							<div className="mb-8 flex justify-end">
								<div className="mr-2 text-gray-500">Descontos:</div>
                <div className="text-gray-500">{order.discount_total}</div>
							</div>
              )}
              {order.tax_total > 0 && (
							<div className="mb-8 flex justify-end">
								<div className="mr-2 text-gray-700">Taxas:</div>
								<div className="text-gray-500">{order.tax_total}</div>
							</div>
              )}
							<div className="mb-8 flex justify-end">
									<div className="mr-2 text-gray-500">Subtotal:</div>
									<div className="text-gray-700">{order.sub_total}</div>
							</div>
							<div className="mb-8 flex justify-end">
									<div className="mr-2 text-gray-500">Total:</div>
									<div className="text-xl font-bold text-gray-700">{order.sub_total_with_tax}</div>
							</div>
							<div className="mb-8 border-t-2 border-gray-300 pt-8">
                {order.payment?.payment_method.is_manual && (
                  <>
									<div className="mb-2 text-gray-500">Complete o pagamento no seu banco utilizando as informações fornecidas. O pagamento geralmente é concluído em 1 a 3 dias úteis, dependendo do sistema bancário e do país envolvido.</div>
									<div className="mb-2 font-bold text-gray-500">Importante: Certifique-se de incluir a sua referência de pagamento: {order.payment?.id.slice(18).toUpperCase()} quando completar o pagamento no banco para fazer corresponder o seu pagamento à sua subscrição com facilidade.</div>
                  </>
                )}
								<div className="text-gray-500">Sobral de Monte Agraço, Portugal</div>
							</div>
						</div>
				) : (
					<div className="flex items-center">
						<div><p>Estamos a processar o seu pedido... Por favor aguarde um momento.</p></div>
            <div><Loading /></div>
					</div>
				)}
			</div>
			</section></>
    )
}
