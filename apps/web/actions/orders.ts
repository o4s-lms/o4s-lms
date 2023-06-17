"use server"

import { cookies } from "next/headers"
import { createClient } from "@o4s/generated-wundergraph/client"
import { CartIdResponseData, ProductsAllResponseData } from "@o4s/generated-wundergraph/models"

const client = createClient({
  customFetch: fetch,
})

type Product = ProductsAllResponseData["products"][number] | undefined
type Cart = CartIdResponseData["cart"]

export async function createOrder(cartId: string, paymentMethod: string) {

	const { data: order, error } = await client.mutate({
		operationName: 'orders/create',
		input: {
			cart_id: cartId,
			payment_method: paymentMethod,
		}
	})
	/**if (order) {
		return order
	}*/
	return order
}

export async function getProduct(productId: string) {
	const { data, error } = await client.query({
		operationName: 'products/all',
		input: {
			locale: 'pt'
		}
	})

	const products = data?.products
	const product: Product = products?.find((t) => t.id === productId)
	return product
}

export async function getProductsToAdd(cart: Cart) {
	const { data, error } = await client.query({
		operationName: 'products/all',
		input: {
			locale: 'pt'
		}
	})

	let products = data?.products
	cart?.items?.forEach((item) => products = products?.filter((t) => t.id !== item.product_id))
	return products
}

async function newCart(productId: string) {

	const product = await getProduct(productId)
	
	if (product) {

		const { data: cart, error } = await client.mutate({
			operationName: 'cart/create',
			input: {
				product_id: product.id,
				price: product.price,
				discount: 0,
				tax: product.tax,
			}
		})
		if (cart) {
			return cart.id
		}
		return null
	}
}

async function addItem(cartId: string, productId: string) {

	const product = await getProduct(productId)
	
	if (product) {

		const { data: cart, error } = await client.mutate({
			operationName: 'cart/add-item',
			input: {
				cart_id: cartId,
				product_id: product.id,
				price: product.price,
				discount: 0,
				tax: product.tax,
			}
		})
		if (cart) {
			return cart.id
		}
	}
}

export async function createCart(productId: string) {

	let cartId = cookies().get('cartId')?.value
	if (!cartId) {
		const cartId = await newCart(productId)
		if (cartId) {
			cookies().set('cartId', cartId)
			return cartId
		}
		return
	}
	cartId = await addItem(cartId, productId)
	if (cartId) {
		return cartId
	}
}