import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import SectionWrapper from "~/components/SectionWrapper";
import UsersHeader from "~/components/ui/users/UsersHeader";
import Loading from "~/components/ui/Loading";
import { Toast } from "primereact/toast";
import FilterUsersList from "~/components/ui/users/FilterUsersList";

type Users = RouterOutputs["user"]["byUserRole"]

const FilterUsers = () => {
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const [currentFilter, changeFilter] = useState<string>('');
	const [filterError, setFilterError] = useState(false);
	const [users, setUsers] = useState<Users>([]);

	const query = router.query;
	let filter: string | undefined = query.filter;

	if (filter) {
		filter = filter.toUpperCase();
		changeFilter(filter);
  }

	useEffect(() => {
		const filterUsers = api.user.byUserRole.useQuery({
			onSuccess() {
				setFilterError(false);
				setUsers(filterUsers.data);
				toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Filter users successfully', life: 3000 });
			},
			onError: (error) => {
				console.error(error);
				setFilterError(true);
				toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
			},
		});
		async function fetchData() {
			await filterUsers.refetch({ role: currentFilter });
		};
		void fetchData();
	}, [currentFilter]);

	return (
		<><Toast ref={toast} />
				<><Header title={`Manage ${currentFilter}`} />
					<Nav />
					<UsersHeader
						currentFilter={currentFilter} />
					<SectionWrapper className="mt-0">
						{filterError ? (
							<p className="text-center text-danger">
                Something went wrong. Please try again.
              </p>
						) : (
							<>
							{users ? (
								<FilterUsersList users={users} />
							) : (
								<Loading />
							)}
							</>
						)}
					</SectionWrapper>
				</>
		</>
	);

};

export default FilterUsers;