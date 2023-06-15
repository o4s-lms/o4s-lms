"use server"

import { cookies } from "next/headers"
import { createClient } from "@o4s/generated-wundergraph/client"
import { ProductsAllResponseData } from "@o4s/generated-wundergraph/models"

const client = createClient({
  customFetch: fetch,
})

type Product = ProductsAllResponseData["products"][number] | undefined

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

export async function createCart(productId: string) {

	const cartId = cookies().get('cartId')?.value
	if (!cartId) {
		const newCartId = await newCart(productId)
		if (newCartId) {
			cookies().set('cartId', newCartId)
			return newCartId
		}
	}
	return cartId
}