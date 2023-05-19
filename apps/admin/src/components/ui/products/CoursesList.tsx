import { api, type RouterOutputs } from "~/utils/api";
import Loading from "./Loading";
import CoursesTable from "./CoursesTable";

type Courses = RouterOutputs["course"]["byProduct"];

const ModulesList: React.FC<{
	courses: Courses;
}> = ({ courses }) => {

	const removeProductMutation = api.product.removeCourse.useMutation({
		onSettled: () => productQuery.refetch(),
	});

	return (
		<>
			{courses ? (

				<div className="w-full">
					{courses.length === 0 ? (
						<span>There are no courses!</span>
					) : (
						<CoursesTable modules={courses} />
					)}
				</div>

			) : (
				<Loading />
			)}
		</>
	)
}

export default ModulesList;