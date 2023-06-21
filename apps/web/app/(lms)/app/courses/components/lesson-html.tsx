import * as React from "react"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"
import { Progress } from "@/components/ui/progress"
import { currentProgress } from "@/actions/courses"
import { Loading } from "@/components/loading"

interface Props {
  courseId: string;
  slug: string;
}

function LessonHtml({ courseId, slug }: Props) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    async function getProgress() {
			const p = await currentProgress(courseId)
			if (!ignore) {
        setProgress(p)
      }
		}
		let ignore = false
		getProgress()
		return () => {
      ignore = true
    }
  }, [courseId])

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
      <>
      <Progress value={progress} className="w-[60%]" />
      <article
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: data?.lesson?.html }}
        >
      </article>
      </>
    ) : (
			<Loading />
		)}
    </>
  )
}

export default withWunderGraph(LessonHtml)
