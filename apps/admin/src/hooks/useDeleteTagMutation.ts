import { useSWRConfig } from 'swr';
import { useMutation, useQuery } from '~/utils/wundergraph';

function useDeleteTagMutation() {
	const { mutate } = useSWRConfig();

	const { data } = useQuery({
		operationName: 'blog/tags',
		input: {
			language: 'pt',
		}
	});

	const deleteTag = useMutation({
		operationName: 'blog/delete-tag'
	});

	const trigger: typeof deleteTag.trigger = async (input, options) => {
		const filteredTags = data?.tags.filter((t) => t.id !== input?.id) || [];

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
				optimisticData: {
					tags: filteredTags,
				},
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