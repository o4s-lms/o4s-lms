import { useSWRConfig } from 'swr'
import { useMutation } from '@/lib/wundergraph'

function useUpdateTestimonialMutation() {
	const { mutate } = useSWRConfig()
	
	const updateTestimonial = useMutation({
		operationName: 'site/update-testimonial'
	})

	const trigger: typeof updateTestimonial.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'site/get-testimonials'
			},
			() => {
				return updateTestimonial.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		)
	}

	return {
		...updateTestimonial,
		trigger,
	}
}

export default useUpdateTestimonialMutation