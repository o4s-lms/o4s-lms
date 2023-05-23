import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useAddCourseProductMutation() {
	const { mutate } = useSWRConfig();
	const addCourse = useMutation({
		operationName: 'products/add-course'
	});

	const trigger: typeof addCourse.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'products/id',
			},
			() => {
				return addCourse.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...addCourse,
		trigger,
	};
}

export default useAddCourseProductMutation;