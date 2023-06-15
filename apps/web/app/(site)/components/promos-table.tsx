import * as React from "react"
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from "next/image"
import Price from './price'
import { Loading } from "@/components/loading"
import { SnackbarProvider, enqueueSnackbar } from "notistack"
import { CartIdResponseData, ProductsAllResponseData } from "@o4s/generated-wundergraph/models"
import { useQuery } from '@/lib/wundergraph'
import useRemoveItemMutation from "@/hooks/orders/use-remove-item-mutation"
import useAddItemMutation from "@/hooks/orders/use-add-item-mutation"
import { getProduct, getProductsToAdd } from "@/actions/orders"

type Cart = CartIdResponseData["cart"] | undefined
type Products = ProductsAllResponseData["products"] | undefined

interface Props {
	cartId: string;
}

function PromosTable({ cart }: Cart) {
  const [cartItems, setCartItems] = React.useState([])
  const [subtotal, setSubtotal] = React.useState(0)
	const removeItem = useRemoveItemMutation()
	const addItem = useAddItemMutation()

	const { data, isLoading } = useQuery({
		operationName: 'products/all',
		input: {
			locale: 'pt',
		}
	})

	let products: Products = data?.products
	cart?.items?.forEach((item) => products = products?.filter((t) => t.id !== item.product_id))

	async function add(productId: string) {
		const product = await getProduct(productId)
		if (!product) {
			enqueueSnackbar('Something went wrong!', { variant: 'error' })
			return
		}
		let discount = 0
		if (cart?.items?.length === 1 && product.price > 0) {
			discount = Math.round(product.price * 40 / 100)
		}
		const added = await addItem.trigger({
			cart_id: cart.id,
			product_id: productId,
			price: product.price,
			discount: discount,
			tax: product.tax,
		}, { throwOnError: false })
		if (added) {
			enqueueSnackbar('Item added successfully!')
		} else {
			enqueueSnackbar('Something went wrong!', { variant: 'error' })
		}
	}

  return (
    <div className="min-h-80 mx-auto my-4 w-full max-w-2xl sm:my-8">
			<SnackbarProvider />
			{!isLoading ? (
      	<table className="mx-auto">
					<thead>
						<tr className="text-palette-primary border-palette-light border-b text-xs uppercase sm:text-sm">
							<th className="font-primary px-6 py-4 font-normal">Curso</th>
							<th className="font-primary hidden px-6 py-4 font-normal sm:table-cell">Preço</th>
							<th className="font-primary px-6 py-4 font-normal">Remover</th>
						</tr>
					</thead>
					<tbody className="divide-palette-lighter divide-y">
						{products?.map(product => (
							<tr key={product.id} className="text-center text-sm text-gray-600 sm:text-base">
								<td className="font-primary flex items-center p-4 font-medium sm:px-6">
									<Image
										src={product.thumbnail}
										alt={product.title}
										height={64}
										width={64}
										className={`hidden sm:inline-flex`} />
									<Link passHref href={`/cursos/${product.slug}`} target="_blank" legacyBehavior>
										<a className="hover:text-palette-dark pt-1">
											{product.title}, {product.include}
										</a>
									</Link>
								</td>
								<td className="font-primary hidden p-4 text-base font-light sm:table-cell sm:px-6">
									<Price
										currency={cart.currency}
										num={product.price}
										numSize="text-lg" />
								</td>
								<td className="font-primary p-4 font-medium sm:px-6">
									<button
										aria-label="delete-item"
										className=""
										onClick={() => add(product.id)}
									>
										<Plus className="text-palette-primary border-palette-primary hover:bg-palette-lighter h-8 w-8 border p-1" />

									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<Loading />
			)}
    </div>
  )
}

export default PromosTable