import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useAddTagMutation() {
	const { mutate } = useSWRConfig();

	const createTag = useMutation({
		operationName: 'blog/create-tag'
	});

	const trigger: typeof createTag.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'blog/tags-all'
			},
			() => {
				return createTag.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...createTag,
		trigger,
	};
}

export default useAddTagMutation;