import Image from "next/image"

import { PlayList } from "../../components/play-list"
import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient({
  customFetch: fetch,
})

export async function generateMetadata({ params }: { params: { slug: string } }) {
	const { data } = await client.query({
		operationName: 'products/slug',
		input: {
			slug: params.slug
		}
	})

	const metadata = data?.product

  return { 
		title: metadata?.title,
		description: metadata?.description,
		og_image: metadata?.image,
		og_title: metadata?.title,
		og_description: metadata?.description,
	}
}

const Curso = async ({ params }: { params: { slug: string } }) => {

	const { data } = await client.query({
		operationName: 'products/all',
		input: {
			locale: 'pt',
		}
	})

	const products = data?.products

	function getProduct(slug: String) {
		// Get the lesson based on the slug
		const product = products?.find((item) => item.slug == slug)
		return product
	}

	const product = getProduct(params.slug)

  return (
    <>

      <div className="mt-16 lg:mt-20">
        <div className="mx-auto lg:max-w-screen-xl lg:px-8">
          <Image
            src={product?.image as string}
            className="w-full rounded-lg"
            alt={product?.title as string}
            width={1200}
            height={628}
          />
        </div>
        <div className="mx-auto mt-12 justify-between gap-8 lg:flex lg:max-w-screen-xl lg:px-8">
          <div className="h-full lg:border-r lg:pr-8 lg:dark:border-gray-800">
            <h1 className="px-4 text-3xl font-semibold text-gray-800 dark:text-white md:px-8 lg:px-0 lg:text-4xl">
              {product?.title}
            </h1>
            <PlayList
              items={products}
              className="sticky -top-1 mt-6 flex-none bg-white px-4 dark:bg-gray-900 md:px-8 lg:hidden lg:px-0"
							slug={params.slug}
            />
            <article
              className="prose dark:prose-invert mt-6 max-w-3xl px-4 md:px-8 lg:px-0"
              dangerouslySetInnerHTML={{ __html: product?.html }}
            ></article>
          </div>
          <div className="hidden flex-none lg:block">
            <PlayList items={products} slug={params.slug} className="sticky top-3 w-full" />
          </div>
        </div>
      </div>

      <style></style>
    </>
  )
}

export default Curso