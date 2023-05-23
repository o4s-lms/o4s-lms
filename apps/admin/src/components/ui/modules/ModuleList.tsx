import Loading from "../Loading";
import LessonsTable from "~/components/ui/lessons/LessonsTable";
import { type ModulesAllResponseData } from "@o4s/generated-wundergraph/models";

const ModulesList: React.FC<{
	modules: ModulesAllResponseData["modules"] | undefined;
}> = ({ modules }) => {

	return (
		<>
			{modules ? (

				<div className="w-full">
					{modules.length === 0 ? (
						<span>There are no modules!</span>
					) : (
						<LessonsTable modules={modules} />
					)}
				</div>

			) : (
				<Loading />
			)}
		</>
	)
}

export default ModulesList;