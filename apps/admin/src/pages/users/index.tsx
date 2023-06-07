import { useState } from "react";
import { useQuery } from "~/utils/wundergraph";

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import SectionWrapper from "~/components/SectionWrapper";
import UsersHeader from "~/components/ui/users/UsersHeader";
import Loading from "~/components/ui/Loading";
import UsersList from "~/components/ui/users/UsersList";

const ManageUsers = () => {
	const [currentFilter, changeFilter] = useState("ALL");

	const { data, error, isLoading } = useQuery({
		operationName: 'users/all',
		enabled: true,
	});

	if (error) {
		return <p>{error.message}</p>;
	}

	return (
		<>
			{!isLoading ? (
				<><Header title={'Manage Users'} />
					<Nav />
					<UsersHeader
						currentFilter={currentFilter} />
					<SectionWrapper className="mt-0">
						<UsersList users={data?.users} />
					</SectionWrapper>
				</>
			) : (
				<Loading />
			)}
		</>
	);

};

export default ManageUsers;