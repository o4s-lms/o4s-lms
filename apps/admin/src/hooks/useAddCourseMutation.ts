import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useAddCourseMutation() {
	const { mutate } = useSWRConfig();

	const createCourse = useMutation({
		operationName: 'courses/create'
	});

	const trigger: typeof createCourse.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'courses/author'
			},
			() => {
				return createCourse.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...createCourse,
		trigger,
	};
}

export default useAddCourseMutation;