import Loading from "~/components/ui/Loading";
import ProductCoursesTable from "./ProductCoursesTable";
import { type CoursesAuthorResponseData } from "@o4s/generated-wundergraph/models";

const CoursesList: React.FC<{
	courses: CoursesAuthorResponseData["courses"];
}> = ({ courses }) => {

	return (
		<>
			{courses ? (

				<div className="w-full">
					{courses?.length === 0 ? (
						<span>There are no courses!</span>
					) : (
						<ProductCoursesTable courses={courses} />
					)}
				</div>

			) : (
				<Loading />
			)}
		</>
	)
}

export default CoursesList;