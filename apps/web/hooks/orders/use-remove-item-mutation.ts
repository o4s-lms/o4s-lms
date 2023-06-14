import { useSWRConfig } from 'swr';
import { useMutation } from '@/lib/wundergraph';

function useRemoveItemMutation() {
	const { mutate } = useSWRConfig();

	const deleteItem = useMutation({
		operationName: 'orders/remove-item'
	});

	const trigger: typeof deleteItem.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'orders/id',
				input: {
					id: input.order_id
				}
			},
			() => {
				return deleteItem.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...deleteItem,
		trigger,
	}
}

export default useRemoveItemMutation