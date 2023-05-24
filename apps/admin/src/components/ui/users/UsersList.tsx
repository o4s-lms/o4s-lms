import { type RouterOutputs } from "~/utils/api";
import Loading from "../Loading";
import UsersTable from "./UsersTable";
import { type UsersAllResponseData } from "@o4s/generated-wundergraph/models";

//type Users = RouterOutputs["user"]["all"];
type Users = UsersAllResponseData["users"];

const UsersList: React.FC<{
	users: Users | undefined;
}> = ({ users }) => {

	return (
		<>
			{users ? (

				<div className="w-full">
					{users.length === 0 ? (
						<span>There are no users!</span>
					) : (
						<UsersTable users={users} />
					)}
				</div>

			) : (
				<Loading />
			)}
		</>
	)
}

export default UsersList;