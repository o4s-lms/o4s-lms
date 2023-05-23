import { useSWRConfig } from 'swr';
import { useMutation, useQuery } from '~/utils/wundergraph';

function useDeleteCourseMutation() {
	const { mutate } = useSWRConfig();
	const { data } = useQuery({
		operationName: 'courses/all'
	});
	const deleteCourse = useMutation({
		operationName: 'courses/delete'
	});

	const trigger: typeof deleteCourse.trigger = async (input, options) => {
		const filteredCourses = data?.courses.filter((t) => t.id !== input?.id) || [];

		return await mutate(
			{
				operationName: 'courses/all',
			},
			() => {
				return deleteCourse.trigger(input, options);
			},
			{
				optimisticData: {
					courses: filteredCourses,
				},
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...deleteCourse,
		trigger,
	};
}

export default useDeleteCourseMutation;