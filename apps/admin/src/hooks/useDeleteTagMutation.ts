import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useDeleteTagMutation() {
	const { mutate } = useSWRConfig();

	const deleteTag = useMutation({
		operationName: 'blog/delete-tag'
	});

	const trigger: typeof deleteTag.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'blog/tags',
				input: {
					languague: 'pt'
				}
			},
			() => {
				return deleteTag.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...deleteTag,
		trigger,
	};
}

export default useDeleteTagMutation;