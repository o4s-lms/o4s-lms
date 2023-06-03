import { useSWRConfig } from 'swr'
import { useMutation } from '@/lib/wundergraph'

function useUpdateFaqMutation() {
	const { mutate } = useSWRConfig()
	
	const updateFaq = useMutation({
		operationName: 'site/update-faq'
	})

	const trigger: typeof updateFaq.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'site/get-tags'
			},
			() => {
				return updateFaq.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		)
	}

	return {
		...updateFaq,
		trigger,
	}
}

export default useUpdateFaqMutation