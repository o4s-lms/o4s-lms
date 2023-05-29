import Image from "next/image"
import Link from "next/link"
import { cx } from "@/lib/utils"
//import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { Image as PhotoIcon } from "lucide-react"
import TagLabel from "./tag"
import { BlogPostsResponseData } from "@o4s/generated-wundergraph/models";

type Post = BlogPostsResponseData["posts"][number]

interface PostListProps {
	post: Post
	aspect?: string
	minimal?: boolean
	pathPrefix?: string
	preloadImage?: boolean
	fontSize?: string
	fontWeight?: string
}

export default function PostList({
  post,
  aspect,
  minimal,
  pathPrefix,
  preloadImage,
  fontSize,
  fontWeight
}: PostListProps) {
  /**const imageProps = post?.mainImage
    ? urlForImage(post.mainImage)
    : null;
  /**const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;*/
	const imageProps = post?.image
	const AuthorimageProps = 'http://joseantcordeiro.hopto.org:9000/uploads/b6d3616df6285312.jpeg'
  return (
    <>
      <div
        className={cx(
          "group cursor-pointer",
          minimal && "grid gap-10 md:grid-cols-2"
        )}>
        <div
          className={cx(
            " overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105   dark:bg-gray-800"
          )}>
          <Link
            className={cx(
              "relative block",
              aspect === "landscape"
                ? "aspect-video"
                : aspect === "custom"
                ? "aspect-[5/4]"
                : "aspect-square"
            )}
            href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${
              post.slug
            }`}>
            {imageProps ? (
              <Image
                src={imageProps}
                {...(post.image && {
                  placeholder: "blur",
                  blurDataURL: post.image
                })}
                alt={post.title || "Thumbnail"}
                priority={preloadImage ? true : false}
                className="object-cover transition-all"
                fill
                sizes="(max-width: 768px) 30vw, 33vw"
              />
            ) : (
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-gray-200">
                <PhotoIcon />
              </span>
            )}
          </Link>
        </div>

        <div className={cx(minimal && "flex items-center")}>
          <div>
            <TagLabel
              tags={post.tags}
              nomargin={minimal}
            />
            <h2
              className={cx(
                fontSize === "large"
                  ? "text-2xl"
                  : minimal
                  ? "text-3xl"
                  : "text-lg",
                fontWeight === "normal"
                  ? "line-clamp-2 font-medium  tracking-normal text-black"
                  : "font-semibold leading-snug tracking-tight",
                "mt-2    dark:text-white"
              )}>
              <Link
                href={`/blogue/post/${pathPrefix ? `${pathPrefix}/` : ""}${
                  post.slug
                }`}>
                <span
                  className="bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom
      bg-no-repeat
      transition-[background-size]
      duration-500
      hover:bg-[length:100%_3px]
      group-hover:bg-[length:100%_10px]
      dark:from-purple-800 dark:to-purple-900">
                  {post.title}
                </span>
              </Link>
            </h2>

            <div className="hidden">
              {post.excerpt && (
                <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                  <Link
                    href={`/blogue/post/${
                      pathPrefix ? `${pathPrefix}/` : ""
                    }${post.slug}`}
                    legacyBehavior>
                    {post.excerpt}
                  </Link>
                </p>
              )}
            </div>

            <div className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400">
              <Link
                href="#"
                legacyBehavior>
                <div className="flex items-center gap-3">
                  <div className="relative h-5 w-5 shrink-0">
                    {AuthorimageProps && (
                      <Image
                        src={AuthorimageProps}
                        alt="José Cordeiro"
                        className="rounded-full object-cover"
                        fill
                        sizes="20px"
                      />
                    )}
                  </div>
                  <span className="truncate text-sm">
                    {/**{post.author.name}*/}
										José Cordeiro
                  </span>
                </div>
              </Link>
              <span className="text-xs text-gray-300 dark:text-gray-600">
                &bull;
              </span>
              <time
                className="truncate text-sm"
                dateTime={post?.publishedAt || post.createdAt}>
                {format(
                  parseISO(post?.publishedAt || post.createdAt),
                  "MMMM dd, yyyy"
                )}
              </time>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}