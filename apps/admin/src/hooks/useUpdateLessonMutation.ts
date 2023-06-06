import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useUpdateLessonMutation() {
	const { mutate } = useSWRConfig();

	const updateLesson = useMutation({
		operationName: 'lessons/update'
	});

	const trigger: typeof updateLesson.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'courses/id',
				input: {
					id: input.course_id,
				}
			},
			() => {
				return updateLesson.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...updateLesson,
		trigger,
	};
}

export default useUpdateLessonMutation;