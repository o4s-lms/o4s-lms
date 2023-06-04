import { useSWRConfig } from 'swr'
import { useMutation } from '@/lib/wundergraph'

function useUpdateHtmlMutation() {
	const { mutate } = useSWRConfig()
	
	const updateHtml = useMutation({
		operationName: 'blog/update-html'
	})

	const trigger: typeof updateHtml.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'blog/posts-all'
			},
			() => {
				return updateHtml.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		)
	}

	return {
		...updateHtml,
		trigger,
	}
}

export default useUpdateHtmlMutation