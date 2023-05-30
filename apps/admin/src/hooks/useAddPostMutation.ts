import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useAddPostMutation() {
	const { mutate } = useSWRConfig();

	const createPost = useMutation({
		operationName: 'blog/create-post'
	});

	const trigger: typeof createPost.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'blog/posts-all'
			},
			() => {
				return createPost.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...createPost,
		trigger,
	};
}

export default useAddPostMutation;