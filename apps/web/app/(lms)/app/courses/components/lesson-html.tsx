import { useQuery, withWunderGraph } from "@/lib/wundergraph"
import { Loading } from "@/components/loading"

interface Props {
  slug: string;
}

function LessonHtml({ slug }: Props) {

  const { data, error, isLoading } = useQuery({
		operationName: 'lessons/slug',
		input: {
			slug: slug,
		},
		enabled: true,
	})

  return (
    <>
    {!isLoading ? (

        <article
          className="prose dark:prose-invert mt-6 max-w-3xl px-4 md:px-8 lg:px-0"
          dangerouslySetInnerHTML={{ __html: data?.lesson?.html }}
        ></article>

    ) : (
			<Loading />
		)}
    </>
  )
}

export default withWunderGraph(LessonHtml)
