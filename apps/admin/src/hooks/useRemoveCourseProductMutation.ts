import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useRemoveCourseProductMutation() {
	const { mutate } = useSWRConfig();
	const removeCourse = useMutation({
		operationName: 'products/remove-course'
	});

	const trigger: typeof removeCourse.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'products/id',
			},
			() => {
				return removeCourse.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...removeCourse,
		trigger,
	};
}

export default useRemoveCourseProductMutation;