"use client"

import Container from "./container"
import { useRouter } from "next/navigation"

import PostList from "./post-list"
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react"
import { useState, useEffect } from "react"

import { BlogTag_slugResponseData } from "@o4s/generated-wundergraph/models"

type Tag = BlogTag_slugResponseData["tag"]

interface ArchiveProps {
	tag: Tag | undefined;
	pageIndex: number;
}

const POSTS_PER_PAGE = 6

export default function TagArchive({ tag, pageIndex }: ArchiveProps) {
  const router = useRouter()
	const [isFirstPage, setIsFirstPage] = useState(false)
  const [isLastPage, setIsLastPage] = useState(false)

	const slug = tag.slug
	const posts = tag.tag_posts

	useEffect(() => {
    setIsFirstPage(pageIndex < 2);
  }, [pageIndex])

  useEffect(() => {
    setIsLastPage(posts.length < POSTS_PER_PAGE);
  }, [posts])

  const handleNextPage = () => {
    router.push(`/blogue/tag/${slug}?page=${pageIndex + 1}`);
  }

  const handlePrevPage = () => {
    router.push(`/blogue/tag/${slug}?page=${pageIndex - 1}`);
  }

  return (
    <>
      <Container>
        <h1 className="text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
          {tag.name}
        </h1>
        <div className="text-center">
          <p className="mt-2 text-lg">
						Veja todos os artigos que já escrevemos.
          </p>
        </div>
        {posts && posts?.length === 0 && (
          <div className="flex h-40 items-center justify-center">
            <span className="text-lg text-gray-500">
							Fim do resultado!
            </span>
          </div>
        )}

        {/**isValidating && (
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
            {new Array(6).fill().map((item, index) => (
              <div key={index}>
                <SkeletonImg />
              </div>
            ))}
          </div>
				)*/}
        {posts && (
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
            {posts.map(post => (
              <PostList key={post.post.id} post={post.post} aspect="square" />
            ))}
          </div>
        )}
        <div className="mt-10 flex items-center justify-center">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination">
            <button
              disabled={isFirstPage}
              onClick={handlePrevPage}
              className="relative inline-flex items-center gap-1 rounded-l-md border border-gray-300 bg-white px-3 py-2 pr-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
              <ChevronLeftIcon
                className="h-3 w-3"
                aria-hidden="true"
              />
              <span>Anterior</span>
            </button>
            <button
              onClick={handleNextPage}
              disabled={isLastPage}
              className="relative inline-flex items-center gap-1 rounded-r-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
              <span>Próximo</span>
              <ChevronRightIcon
                className="h-3 w-3"
                aria-hidden="true"
              />
            </button>
          </nav>
        </div>
      </Container>
    </>
  )
}