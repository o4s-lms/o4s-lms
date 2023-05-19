import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import SectionWrapper from "~/components/SectionWrapper";
import UsersHeader from "~/components/ui/users/UsersHeader";
import Loading from "~/components/ui/Loading";
import UsersList from "~/components/ui/users/UsersList";
import { Toast } from "primereact/toast";

const ManageUsers = () => {
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const [currentFilter, changeFilter] = useState("ALL");

	const userQuery = api.user.all.useQuery({ skip: 0, take: 50 });

	return (
		<><Toast ref={toast} />
			{userQuery.data ? (
				<><Header title={'Manage Users'} />
					<Nav />
					<UsersHeader
						currentFilter={currentFilter} />
					<SectionWrapper className="mt-0">
						<UsersList users={userQuery.data} />
					</SectionWrapper>
				</>
			) : (
				<Loading />
			)}
		</>
	);

};

export default ManageUsers;