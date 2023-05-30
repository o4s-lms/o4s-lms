import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useUpdateTagMutation() {
	const { mutate } = useSWRConfig();
	
	const updateTag = useMutation({
		operationName: 'blog/update-tag'
	});

	const trigger: typeof updateTag.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'blog/tags-all'
			},
			() => {
				return updateTag.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...updateTag,
		trigger,
	};
}

export default useUpdateTagMutation;