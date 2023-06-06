import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useDeleteModuleMutation() {
	const { mutate } = useSWRConfig();

	const deleteModule = useMutation({
		operationName: 'modules/delete'
	});

	const trigger: typeof deleteModule.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'courses/id',
				input: {
					id: input.course_id,
				}
			},
			() => {
				return deleteModule.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...deleteModule,
		trigger,
	};
}

export default useDeleteModuleMutation;