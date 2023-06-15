import * as React from "react"
import { X, Plus } from 'lucide-react'
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

type Cart = CartIdResponseData["cart"]
type Products = ProductsAllResponseData["products"] | undefined

interface Props {
	cartId: string;
}

async function CartTable({ cartId }: Props) {
  const [cartItems, setCartItems] = React.useState([])
  const [subtotal, setSubtotal] = React.useState(0)
	const removeItem = useRemoveItemMutation()
	const addItem = useAddItemMutation()

	const { data, isLoading } = useQuery({
		operationName: 'cart/id',
		input: {
			id: cartId,
		}
	})

	const cart: Cart = data?.cart
	const products: Products = await getProductsToAdd(cart)

	async function remove(productId: string) {
		const removed = await removeItem.trigger({
			cart_id: cartId,
			product_id: productId,
		}, { throwOnError: false })
		if (removed) {
			enqueueSnackbar('Item removed successfully!')
		} else {
			enqueueSnackbar('Something went wrong!', { variant: 'error' })
		}
	}

	async function add(productId: string) {
		const product = await getProduct(productId)
		if (!product) {
			enqueueSnackbar('Something went wrong!', { variant: 'error' })
			return
		}
		let discount = 0
		if (cart?.items?.length == 1 && product.price > 0) {
			discount = Math.round(product.price * 40 / 100)
		}
		const added = await addItem.trigger({
			cart_id: cartId,
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
      <><table className="mx-auto">
					<thead>
						<tr className="text-palette-primary border-palette-light border-b text-xs uppercase sm:text-sm">
							<th className="font-primary px-6 py-4 font-normal">Curso</th>
							{/**<th className="font-primary px-6 py-4 font-normal">Quantidade</th>*/}
							<th className="font-primary hidden px-6 py-4 font-normal sm:table-cell">Preço</th>
							<th className="font-primary px-6 py-4 font-normal">Remover</th>
						</tr>
					</thead>
					<tbody className="divide-palette-lighter divide-y">
						{cart?.items?.map(item => (
							<tr key={item.product.id} className="text-center text-sm text-gray-600 sm:text-base">
								<td className="font-primary flex items-center p-4 font-medium sm:px-6">
									<Image
										src={item.product.thumbnail}
										alt={item.product.title}
										height={64}
										width={64}
										className={`hidden sm:inline-flex`} />
									<Link passHref href={`/cursos/${item.product.slug}`} target="_blank" legacyBehavior>
										<a className="hover:text-palette-dark pt-1">
											{item.product.title}, {item.product.include}
										</a>
									</Link>
								</td>
								{/**<td className="font-primary p-4 font-medium sm:px-6">
              <input
                type="number"
                inputMode="numeric"
                id="variant-quantity"
                name="variant-quantity"
                min="1"
                step="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.variantId, e.target.value)}
                className="form-input focus:border-palette-light focus:ring-palette-light w-16 rounded-sm border border-gray-300 text-gray-900"
              />
                          </td>*/}
								<td className="font-primary hidden p-4 text-base font-light sm:table-cell sm:px-6">
									<Price
										currency={cart.currency}
										num={item.price}
										numSize="text-lg" />
								</td>
								<td className="font-primary p-4 font-medium sm:px-6">
									<button
										aria-label="delete-item"
										className=""
										onClick={() => remove(item.product.id)}
									>
										<X className="text-palette-primary border-palette-primary hover:bg-palette-lighter h-8 w-8 border p-1" />

									</button>
								</td>
							</tr>
						))}
						{cart?.discount_total === 0 ?
							null
							:
							<tr className="text-center">
								<td></td>
								<td className="font-primary p-4 text-base font-semibold uppercase text-gray-600 sm:px-6">Descontos</td>
								<td className="font-primary text-palette-primary p-4 text-lg font-medium sm:px-6">
									<Price
										currency="eur"
										num={cart?.discount_total}
										numSize="text-xl" />
								</td>
								<td></td>
							</tr>}
						{cart?.sub_total === 0 ?
							null
							:
							<tr className="text-center">
								<td></td>
								<td className="font-primary p-4 text-base font-semibold uppercase text-gray-600 sm:px-6">Subtotal</td>
								<td className="font-primary text-palette-primary p-4 text-lg font-medium sm:px-6">
									<Price
										currency="eur"
										num={cart?.sub_total}
										numSize="text-xl" />
								</td>
								<td></td>
							</tr>}
					</tbody>
				</table>
					<table className="mx-auto">
						<thead>
							<tr className="text-palette-primary border-palette-light border-b text-xs uppercase sm:text-sm">
								<th className="font-primary px-6 py-4 font-normal">Curso</th>
								{/**<th className="font-primary px-6 py-4 font-normal">Quantidade</th>*/}
								<th className="font-primary hidden px-6 py-4 font-normal sm:table-cell">Preço</th>
								<th className="font-primary px-6 py-4 font-normal">Adicionar</th>
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
									{/**<td className="font-primary p-4 font-medium sm:px-6">
											<input
													type="number"
													inputMode="numeric"
													id="variant-quantity"
													name="variant-quantity"
													min="1"
													step="1"
													value={item.quantity}
													onChange={(e) => updateItem(item.variantId, e.target.value)}
													className="form-input focus:border-palette-light focus:ring-palette-light w-16 rounded-sm border border-gray-300 text-gray-900"
											/>
									</td>*/}
									<td className="font-primary hidden p-4 text-base font-light sm:table-cell sm:px-6">
										<Price
											currency={product.currency}
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
					</table></>
			) : (
				<Loading />
			)}
    </div>
  )
}

export default CartTable