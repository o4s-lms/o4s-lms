import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useDeleteLessonMutation() {
	const { mutate } = useSWRConfig();

	const deleteLesson = useMutation({
		operationName: 'lessons/delete'
	});

	const trigger: typeof deleteLesson.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'courses/id',
				input: {
					id: input.course_id,
				}
			},
			() => {
				return deleteLesson.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...deleteLesson,
		trigger,
	};
}

export default useDeleteLessonMutation;