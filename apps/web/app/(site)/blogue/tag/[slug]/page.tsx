"use client"

import { useSearchParams } from "next/navigation"

import TagArchive from "../../components/tag-archive"

import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient({
  customFetch: fetch,
})
const POSTS_PER_PAGE = 6

export default async function TagArchivePage({ params }: { params: { slug: string } }) {
	const searchParams = useSearchParams()
  const page = searchParams.get("page")
  const pageIndex = parseInt(page) || 1

  // [(($pageIndex - 1) * 10)...$pageIndex * 10]{
  const paramsForQuery = {
    pageIndex: (pageIndex - 1) * POSTS_PER_PAGE,
    limit: pageIndex * POSTS_PER_PAGE
  }

	const { data, error } = await client.query({
		operationName: 'blog/tag-slug',
		input: {
			slug: params.slug,
		}
	})

	const tag = data?.tag

  return (
		<>
			<TagArchive tag={tag} pageIndex={pageIndex} />
		</>
	)
}