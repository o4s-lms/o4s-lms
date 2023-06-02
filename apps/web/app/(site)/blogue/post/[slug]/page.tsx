import PostPage from "./default"
import { site } from "@o4s/db"
import { client } from "@/lib/client"

import { Loading } from "@/components/loading";

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

	const metadata = await site.post.findUnique({
		where: { slug: params.slug },
		select: {
			meta_title: true,
			meta_description: true,
			og_image: true,
			og_title: true,
			og_description: true,
		}
	})
  return { 
		title: metadata?.meta_title,
		description: metadata?.meta_description,
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

  return (
		<>
			<PostPage post={post} />
		</>
	)

}

// export const revalidate = 60;