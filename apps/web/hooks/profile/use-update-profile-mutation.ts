import { useSWRConfig } from 'swr';
import { useMutation } from '@/lib/wundergraph';

function useUpdateProfileMutation() {
	const { mutate } = useSWRConfig();

	const updateProfile = useMutation({
		operationName: 'users/update-profile'
	});

	const trigger: typeof updateProfile.trigger = async (input, options) => {

		return await mutate(
			{
				operationName: 'users/me'
			},
			() => {
				return updateProfile.trigger(input, options);
			},
			{
				populateCache: false,
				revalidate: true,
				rollbackOnError: true,
			}
		);
	};

	return {
		...updateProfile,
		trigger,
	};
}

export default useUpdateProfileMutation;