import { useSWRConfig } from 'swr';
import { useMutation, useQuery } from '~/utils/wundergraph';

function useDeletePostMutation() {
	const { mutate } = useSWRConfig();

	const { data } = useQuery({
		operationName: 'blog/posts-all'
	});

	const deletePost = useMutation({
		operationName: 'blog/delete-post'
	});

	const trigger: typeof deletePost.trigger = async (input, options) => {
		const filteredPosts = data?.posts.filter((t) => t.id !== input?.id) || [];

		return await mutate(
			{
				operationName: 'blog/posts-all'
			},
			() => {
				return deletePost.trigger(input, options);
			},
			{
				optimisticData: {
					tags: filteredPosts,
				},
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...deletePost,
		trigger,
	};
}

export default useDeletePostMutation;