import { useSWRConfig } from 'swr';
import { useMutation } from '@/lib/wundergraph';

function useRemoveItemMutation() {
	const { mutate } = useSWRConfig();

	const deleteItem = useMutation({
		operationName: 'cart/remove-item'
	});

	const trigger: typeof deleteItem.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'cart/id',
				input: {
					id: input.cart_id
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