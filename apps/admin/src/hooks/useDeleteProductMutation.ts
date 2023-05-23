import { useSWRConfig } from 'swr';
import { useMutation, useQuery } from '~/utils/wundergraph';

function useDeleteProductMutation() {
	const { mutate } = useSWRConfig();
	const { data } = useQuery({
		operationName: 'products/all'
	});
	const deleteProduct = useMutation({
		operationName: 'product/delete'
	});

	const trigger: typeof deleteProduct.trigger = async (input, options) => {
		const filteredProducts = data?.products.filter((t) => t.id !== input?.id) || [];

		return await mutate(
			{
				operationName: 'products/all',
			},
			() => {
				return deleteProduct.trigger(input, options);
			},
			{
				optimisticData: {
					products: filteredProducts,
				},
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...deleteProduct,
		trigger,
	};
}

export default useDeleteProductMutation;