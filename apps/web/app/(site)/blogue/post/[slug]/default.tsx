import Image from "next/image"
import Link from "next/link"
import Container from "../../components/container"
import { notFound } from "next/navigation"
import { parseISO, format } from "date-fns"

import TagLabel from "../../components/tag"
import { BlogPost_slugResponseData } from "@o4s/generated-wundergraph/models"

type Post = BlogPost_slugResponseData["post"]

interface PostPageProps {
	post: Post
}

interface MainImageProps {
	image: string;
	feature_image_alt: string;
	feature_image_caption: string;
}

export default function PostPage({ post }: PostPageProps) {

  const slug = post?.slug;

  if (!slug) {
    notFound();
  }

  /**const imageProps = post?.mainImage
    ? urlForImage(post?.mainImage)
    : null;

  const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;*/

	const imageProps = 'http://joseantcordeiro.hopto.org:9000/web/blogue' + post?.feature_image
	const AuthorimageProps = 'http://joseantcordeiro.hopto.org:9000/uploads/b6d3616df6285312.jpeg'

  return (
    <>
      <Container className="!pt-0">
        <div className="mx-auto max-w-screen-md ">
          <div className="flex justify-center">
            <TagLabel tags={post.post_tags} />
          </div>

          <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
            {post.title}
          </h1>

          <div className="mt-3 flex justify-center space-x-3 text-gray-500 ">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0">
                {AuthorimageProps && (
                    <Image
                      src={AuthorimageProps}
                      alt="José Cordeiro"
                      className="rounded-full object-cover"
                      fill
                      sizes="40px"
                    />
                )}
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-400">
                  José Cordeiro
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <time
                    className="text-gray-500 dark:text-gray-400"
                    dateTime={post?.published_at || post.created_at}>
                    {format(
                      parseISO(post?.published_at || post.created_at),
                      "MMMM dd, yyyy"
                    )}
                  </time>
                  <span>· {post.est_reading_time || "5"} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
        {imageProps && (
          <Image
            src={imageProps}
            alt={post.post_meta.feature_image_caption || "Thumbnail"}
            loading="eager"
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      <Container>
        <article className="mx-auto max-w-screen-md ">
					{post.html && <div className="prose dark:prose-invert prose-a:text-blue-600 mx-auto my-3 space-y-3"
						dangerouslySetInnerHTML={{ __html: post.html }}
					/>}
          <div className="my-7 flex justify-center">
            <Link
              href="/"
              className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 ">
              ← View all posts
            </Link>
          </div>
          
        </article>
      </Container>
    </>
  )
}

const MainImage = ({ image, feature_image_alt, feature_image_caption }: MainImageProps) => {
  return (
    <div className="my-12">
      <Image src={image} alt={feature_image_alt || "Thumbnail"} />
      <figcaption className="text-center ">
        {feature_image_caption && (
          <span className="text-sm italic text-gray-600 dark:text-gray-400">
            {feature_image_caption}
          </span>
        )}
				</figcaption>
    </div>
  )
}