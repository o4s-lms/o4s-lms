import { useSWRConfig } from 'swr'
import { useMutation } from '@/lib/wundergraph'

function useLessonCompletedMutation() {
	const { mutate } = useSWRConfig()

	const lessonCompleted = useMutation({
		operationName: 'lessons/completed'
	});

	const trigger: typeof lessonCompleted.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'lessons/slug',
        input: {
          slug: slug
        }
			},
			() => {
				return lessonCompleted.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		)
	}

	return {
		...lessonCompleted,
		trigger,
	}
}

export default useLessonCompletedMutation
