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
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: data?.lesson?.html }}
        ></article>

    ) : (
			<Loading />
		)}
    </>
  )
}

export default withWunderGraph(LessonHtml)
