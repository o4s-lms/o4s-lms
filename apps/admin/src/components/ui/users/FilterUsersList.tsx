import { type RouterOutputs } from "~/utils/api";
import Loading from "../Loading";
import FilterUsersTable from "./FilterUsersTable";

type Users = RouterOutputs["user"]["byUserRole"];

const FilterUsersList: React.FC<{
	users: Users;
}> = ({ users }) => {

	return (
		<>
			{users ? (

				<div className="w-full">
					{users.length === 0 ? (
						<span>There are no users!</span>
					) : (
						<FilterUsersTable users={users} />
					)}
				</div>

			) : (
				<Loading />
			)}
		</>
	)
}

export default FilterUsersList;