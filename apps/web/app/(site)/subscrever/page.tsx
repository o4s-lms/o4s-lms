"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { enqueueSnackbar } from "notistack"
import { createClient } from "@o4s/generated-wundergraph/client"
import useCreateOrderMutation from "@/hooks/orders/use-create-order-mutation"
import { MoveRight, MoveLeft } from 'lucide-react'
import { ProductsAllResponseData, OrdersIdResponseData } from "@o4s/generated-wundergraph/models"
import CartTable from "../components/cart-table"
import PromosTable from "../components/promos-table"
import { Loading } from "@/components/loading"
import { createCart } from "@/actions/orders"

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
}*/

async function getCookie(key: string) {
	if(typeof document !== 'undefined') {
		var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
		return b ? b.pop() : "";
	}
}

export default async function Subscrever() {
	const stepsItems = ["Carrinho", "Pagamento", "Identificação", "Conclusão"]
	//const [isMutating, setIsMutating] = React.useState<boolean>(false)
	const [currentStep, setCurrentStep] = React.useState<number>(1)
	const [cartId, setCartId] = React.useState<string | null>(null)
	const searchParams = useSearchParams()
  const productId = searchParams.get("product") || ''
	//let cartId = await getCookie("cartId")

	/**if (!cartId) {
		cartId = await createCart(productId)
	}*/

	React.useEffect(() => {
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
  }, [cartId, productId])

	function BackToCartButton() {

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
				{cartId ? (
					<CartTable cartId={cartId} />
				) : (
					'Loading...'
				)}
				
				{/**<PromosTable card={card} />*/}
				<a
					onClick={() => setCurrentStep(2)}
					aria-label="checkout-products"
					className="bg-palette-primary font-primary focus:ring-palette-light hover:bg-palette-dark flex w-full items-center justify-center rounded-sm 
					pb-1 pt-2 text-lg font-semibold leading-relaxed text-white focus:outline-none focus:ring-1"
				>
					Pagamento
					<MoveRight className="ml-2 inline-flex w-4"/>
				</a>
				
			</div>

			<div className={`${currentStep == 2 ? "" : "hidden"} {steps.currentStep == 1 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
				<p>Step 2</p>
				<Link href="/" passHref legacyBehavior>
					<a
						aria-label="back-to-products"
						className="border-palette-primary text-palette-primary font-primary focus:ring-palette-light hover:bg-palette-lighter flex w-full items-center justify-center rounded-sm 
					border pb-1 pt-2 text-lg font-semibold leading-relaxed focus:outline-none focus:ring-1"
					>
						<MoveLeft className="ml-2 inline-flex w-4"/>
						Back To All Products
					</a>
				</Link>
				<a
					onClick={() => setCurrentStep(3)}	className="hover:text-primary underline underline-offset-4"
					>
					Step 3
				</a>
			</div>
			<div className={`${currentStep == 3 ? "" : "hidden"} {steps.currentStep == 1 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
				<p>Step 3</p>
				<a
					onClick={() => setCurrentStep(4)}	className="hover:text-primary underline underline-offset-4"
					>
					Step 4
				</a>
			</div>
			<div className={`${currentStep == 4 ? "" : "hidden"} {steps.currentStep == 1 ? "" : "hidden"} mx-auto max-w-2xl p-4 md:px-0`}>
				<p>Step 4</p>
			</div>
			</section></>
    )
}