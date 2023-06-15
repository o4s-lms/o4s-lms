"use server"

import { cookies } from "next/headers"
import { createClient } from "@o4s/generated-wundergraph/client"
import { CartIdResponseData, ProductsAllResponseData } from "@o4s/generated-wundergraph/models"
import { undefined } from "zod"

const client = createClient({
  customFetch: fetch,
})

type Product = ProductsAllResponseData["products"][number] | undefined
type Cart = CartIdResponseData["cart"]

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
	//productIds.forEach((productId) => products = products?.filter((t) => t.id !== productId))
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