import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useUpdateHtmlMutation() {
	const { mutate } = useSWRConfig();

	const updateHtml = useMutation({
		operationName: 'lessons/update-html'
	});

	const trigger: typeof updateHtml.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'lessons/id',
				input: {
					id: input.id,
				}
			},
			() => {
				return updateHtml.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...updateHtml,
		trigger,
	};
}

export default useUpdateHtmlMutation;