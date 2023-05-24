import { useSWRConfig } from 'swr';
import { useMutation } from '~/utils/wundergraph';

function useAddProductMutation() {
	const { mutate } = useSWRConfig();
	
	const addProduct = useMutation({
		operationName: 'products/create'
	});

	const trigger: typeof addProduct.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'products/all',
			},
			() => {
				return addProduct.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...addProduct,
		trigger,
	};
}

export default useAddProductMutation;