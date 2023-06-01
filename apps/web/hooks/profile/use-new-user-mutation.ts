import { useSWRConfig } from 'swr';
import { useMutation } from '@/lib/wundergraph';

function useNewUserMutation() {
	const { mutate } = useSWRConfig();

	const createUser = useMutation({
		operationName: 'users/create'
	});

	const trigger: typeof createUser.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'users/me'
			},
			() => {
				return createUser.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...createUser,
		trigger,
	};
}

export default useNewUserMutation;