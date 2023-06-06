import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useCreateModuleMutation() {
	const { mutate } = useSWRConfig();

	const createModule = useMutation({
		operationName: 'modules/create'
	});

	const trigger: typeof createModule.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'courses/id',
				input: {
					id: input.course_id,
				}
			},
			() => {
				return createModule.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...createModule,
		trigger,
	};
}

export default useCreateModuleMutation;