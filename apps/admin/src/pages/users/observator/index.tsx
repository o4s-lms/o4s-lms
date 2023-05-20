import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import SectionWrapper from "~/components/SectionWrapper";
import UsersHeader from "~/components/ui/users/UsersHeader";
import Loading from "~/components/ui/Loading";
import { Toast } from "primereact/toast";
import FilterUsersList from "~/components/ui/users/FilterUsersList";

const FilterUsers = () => {
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const [currentFilter, changeFilter] = useState("OBSERVATOR");
	const filterError = false;
	
	const filterUsers = api.user.byUserRole.useQuery({ skip: 0, take: 50, role: currentFilter });

	if (filterError) {
		return <p>Something is wrong.</p>
	}

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
							{filterUsers.data ? (
								<FilterUsersList users={filterUsers.data} />
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