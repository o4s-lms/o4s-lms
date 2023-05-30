import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useUpdatePostMutation() {
	const { mutate } = useSWRConfig();
	
	const updatePost = useMutation({
		operationName: 'blog/update-post'
	});

	const trigger: typeof updatePost.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'blog/posts-all'
			},
			() => {
				return updatePost.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...updatePost,
		trigger,
	};
}

export default useUpdatePostMutation;