import { useState, useEffect } from 'react'
//import { useUpdateCartQuantityContext } from '@/context/Store'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { X } from 'lucide-react'
import Link from 'next/link'
import Price from './price'
import { SnackbarProvider, enqueueSnackbar } from "notistack"
import { CartIdResponseData } from "@o4s/generated-wundergraph/models"
import { useQuery } from '@/lib/wundergraph'
import useRemoveItemMutation from '@/hooks/orders/use-remove-item-mutation'

type Cart = CartIdResponseData["cart"]

interface Props {
	cartId: string;
}

function CartTable({ cartId }: Props) {
  //const updateCartQuantity = useUpdateCartQuantityContext()
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
	const removeItem = useRemoveItemMutation()

	const { data, isLoading } = useQuery({
		operationName: 'cart/id',
		input: {
			id: cartId,
		}
	})

	const cart: Cart = data?.cart

  //function updateItem(id, quantity) {
    //updateCartQuantity(id, quantity)
  //}

	async function remove(orderId: string, productId: string) {
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

  return (
    <div className="min-h-80 mx-auto my-4 w-full max-w-2xl sm:my-8">
      <table className="mx-auto">
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
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  height={64}
                  width={64}
                  className={`hidden sm:inline-flex`}
                />
                <Link passHref href={`/cursos/${item.product.slug}`}>
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
                  numSize="text-lg"
                />
              </td>
              <td className="font-primary p-4 font-medium sm:px-6">
                <button
                  aria-label="delete-item"
                  className=""
                  onClick={() => remove(cartId, item.product.id)}
                >
									<X className="text-palette-primary border-palette-primary hover:bg-palette-lighter h-8 w-8 border p-1" />
    
                </button>
              </td>
            </tr>
          ))}
          {
            cart?.sub_total === 0 ?
              null
              :
              <tr className="text-center">
                <td></td>
                <td className="font-primary p-4 text-base font-semibold uppercase text-gray-600 sm:px-6">Subtotal</td>
                <td className="font-primary text-palette-primary p-4 text-lg font-medium sm:px-6">
                  <Price
                    currency="eur"
                    num={cart?.sub_total}
                    numSize="text-xl"
                  />
                </td>
                <td></td>
              </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export default CartTable