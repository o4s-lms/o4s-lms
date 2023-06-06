import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useUpdateModuleMutation() {
	const { mutate } = useSWRConfig();

	const updateModule = useMutation({
		operationName: 'modules/update'
	});

	const trigger: typeof updateModule.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'courses/id',
				input: {
					id: input.course_id,
				}
			},
			() => {
				return updateModule.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...updateModule,
		trigger,
	};
}

export default useUpdateModuleMutation;