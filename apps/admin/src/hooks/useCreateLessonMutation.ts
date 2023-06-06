import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useCreateLessonMutation() {
	const { mutate } = useSWRConfig();

	const createLesson = useMutation({
		operationName: 'lessons/create'
	});

	const trigger: typeof createLesson.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'courses/id',
				input: {
					id: input.course_id,
				}
			},
			() => {
				return createLesson.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...createLesson,
		trigger,
	};
}

export default useCreateLessonMutation;