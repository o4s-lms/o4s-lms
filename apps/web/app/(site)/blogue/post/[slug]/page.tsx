import PostPage from "./default"
import { site } from "@o4s/db"
import { createClient } from "@o4s/generated-wundergraph/client"

import { Loading } from "@/components/loading";
import { BlogMetadataResponseData } from "@o4s/generated-wundergraph/models";
import { useEffectOnce } from "usehooks-ts";
type Post = BlogMetadataResponseData["post"]

const client = createClient()

export async function generateStaticParams() {

  return await site.post.findMany({
		where: {
			published: true,
			language: "pt",
		},
		select: {
			slug: true
		},
	})
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
	const { data } = await client.query({
		operationName: 'blog/metadata',
		input: {
			slug: params.slug
		}
	})

	const metadata = data?.post

	/**const metadata = await site.post.findUnique({
		where: { slug: params.slug },
		select: {
			post_meta: {
				select: {
					meta_title: true,
					meta_description: true,
					og_image: true,
					og_title: true,
					og_description: true,
				}
			}
		}
	})*/
  return { 
		title: metadata?.post_meta?.meta_title,
		description: metadata?.post_meta?.meta_description,
		og_image: metadata?.post_meta?.og_image,
		og_title: metadata?.post_meta?.og_title,
		og_description: metadata?.post_meta?.og_description,
	}
}

export default async function PostDefault({ params }: { params: { slug: string } }) {

	const { data, error } = await client.query({
		operationName: 'blog/post-slug',
		input: {
			slug: params.slug
		}
	})

  const post = data?.post

	useEffectOnce(() => {
		const _res = client.mutate({
			operationName: 'blog/views',
			input: {
				id: post?.id as string,
			},
		})
  })

  return (
		<>
			<PostPage post={post} />
		</>
	)

}

// export const revalidate = 60;