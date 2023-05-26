import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useAddModuleCourseMutation() {
	const { mutate } = useSWRConfig();
	
	const addModule = useMutation({
		operationName: 'modules/create'
	});

	const trigger: typeof addModule.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'courses/id',
				input: {
					id: input.courseId,
				},
			},
			() => {
				return addModule.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...addModule,
		trigger,
	};
}

export default useAddModuleCourseMutation;