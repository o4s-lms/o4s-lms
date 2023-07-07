import * as React from "react"
import { useQuery, withWunderGraph } from "@/lib/wundergraph"
import { Progress } from "@/components/ui/progress"
import { currentProgress } from "@/actions/courses"
import { Loading } from "@/components/loading"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

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
      <div className="space-y-0.5">
				<h2 className="text-2xl font-bold tracking-tight">{data?.lesson?.name}</h2>
			</div>
      <Separator className="my-6" />
      <article
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: data?.lesson?.html }}
        >
      </article>
      <Separator className="my-6" />
      <div className="flex items-center justify-center">
        <div className="w-[60%] flex-initial">
          <Progress value={progress} />
        </div>
        <div className="px-6">
          <button

            className="relative inline-flex items-center gap-1 rounded-r-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
            <span>Completo e Próximo</span>
            <ChevronRightIcon
              className="h-3 w-3"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="mt-10 flex items-center justify-center">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination">
          <button

            className="relative inline-flex items-center gap-1 rounded-l-md border border-gray-300 bg-white px-3 py-2 pr-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
            <ChevronLeftIcon
              className="h-3 w-3"
              aria-hidden="true"
            />
            <span>Anterior</span>
          </button>
          <button

            className="relative inline-flex items-center gap-1 rounded-r-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
            <span>Próximo</span>
            <ChevronRightIcon
              className="h-3 w-3"
              aria-hidden="true"
            />
          </button>
        </nav>
      </div>
      </>
    ) : (
			<Loading />
		)}
    </>
  )
}

export default withWunderGraph(LessonHtml)
