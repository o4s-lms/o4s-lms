import Image from "next/image"
// import { urlForImage } from "@/lib/sanity/image"
import { parseISO, format } from "date-fns"
import { cx } from "@/lib/utils"
import Link from "next/link"
import { BlogPostsResponseData } from "@o4s/generated-wundergraph/models";

type Post = BlogPostsResponseData["posts"][number]

interface FeaturedProps {
	post: Post
	pathPrefix?: string
}

export default function Featured({ post, pathPrefix }: FeaturedProps) {
  /**const imageProps = post?.mainImage
    ? urlForImage(post?.mainImage)
    : null;

  const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;*/
	const imageProps = post?.image
		const AuthorimageProps = 'http://joseantcordeiro.hopto.org:9000/uploads/b6d3616df6285312.jpeg'
  return (
    <div
      className={cx(
        "grid md:grid-cols-2 gap-5 md:gap-10 md:min-h-[calc(100vh-30vh)]"
      )}
      style={{
        backgroundColor: "black"
      }}>
      {imageProps && (
        <div className="relative aspect-video md:aspect-auto">
          <Link
            href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${
              post.slug
            }`}>
            <Image
              src={imageProps}
              {...(post.image && {
                placeholder: "blur",
                blurDataURL: post.image
              })}
              alt={post.title || "Thumbnail"}
              priority
              fill
              sizes="100vw"
              className="object-cover"
            />
          </Link>
        </div>
      )}

      <div className="self-center px-5 pb-10">
        <Link
          href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${
            post.slug
          }`}>
          <div className="max-w-2xl">
            <h1 className="text-brand-primary mb-3 mt-2 text-3xl font-semibold tracking-tight text-white lg:text-5xl lg:leading-tight">
              {post.title}
            </h1>

            <div className="mt-4 flex space-x-3 text-gray-500 md:mt-8 ">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <div className="relative h-5 w-5 shrink-0">
                    {AuthorimageProps && (
                      <Image
                        src={AuthorimageProps}
                        alt="José Cordeiro"
                        className="rounded-full object-cover"
                        fill
                        sizes="100vw"
                      />
                    )}
                  </div>
                  <p className="text-gray-100 ">
                    {"José Cordeiro "}
                    <span className="hidden pl-2 md:inline"> ·</span>
                  </p>
                </div>

                <div>
                  <div className="flex space-x-2 text-sm md:flex-row md:items-center">
                    <time
                      className="text-white"
                      dateTime={post?.publishedAt || post.createdAt}>
                      {format(
                        parseISO(
                          post?.publishedAt || post.createdAt
                        ),
                        "MMMM dd, yyyy"
                      )}
                    </time>
                    <span className="text-white">
                      · {post.estReadingTime || "5"} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}