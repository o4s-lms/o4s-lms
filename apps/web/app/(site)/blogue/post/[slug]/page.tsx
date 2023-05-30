import { useQuery } from "@/lib/wundergraph"
import PostPage from "./default"

import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";
import { Loading } from "@/components/loading";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  return { 
		title: post.title,
		description: post.description
	}
}

export default async function PostDefault({ params }: { params: { slug: string } }) {
	const { data, error, isLoading } = useQuery({
		operationName: 'blog/post-slug',
		input: {
			slug: params.slug
		}
	})

  const post = data?.post

  return (
		<>
		{!isLoading ? (
			<PostPage post={post} />
		) : (
			<Loading />
		)}
		</>
	)

}

// export const revalidate = 60;