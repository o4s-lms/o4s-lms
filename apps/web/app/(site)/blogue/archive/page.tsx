"use client"

import { useSearchParams } from "next/navigation"

import Archive from "../components/archive"

import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient()
const POSTS_PER_PAGE = 6

export default async function ArchivePage() {
	const searchParams = useSearchParams()
  const page = searchParams.get("page")
  const pageIndex = parseInt(page) || 1

  // [(($pageIndex - 1) * 10)...$pageIndex * 10]{
  const paramsForQuery = {
    pageIndex: (pageIndex - 1) * POSTS_PER_PAGE,
    limit: pageIndex * POSTS_PER_PAGE
  }

	const { data, error } = await client.query({
		operationName: 'blog/posts',
		input: {
			language: 'pt',
			skip: (pageIndex - 1) * POSTS_PER_PAGE,
			take: POSTS_PER_PAGE,
		}
	})

	const posts = data?.posts

  return (
		<>
			<Archive posts={posts} pageIndex={pageIndex} />
		</>
	)
}
