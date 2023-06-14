import { useSWRConfig } from 'swr';
import { useMutation } from '@/lib/wundergraph';

function useAddItemMutation() {
	const { mutate } = useSWRConfig();

	const addItem = useMutation({
		operationName: 'cart/add-item'
	});

	const trigger: typeof addItem.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'cart/id',
				input: {
					id: input.cart_id
				}
			},
			() => {
				return addItem.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...addItem,
		trigger,
	}
}

export default useAddItemMutation