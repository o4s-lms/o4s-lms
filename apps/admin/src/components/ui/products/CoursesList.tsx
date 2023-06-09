import Loading from "~/components/ui/Loading";
import ProductCoursesTable from "./ProductCoursesTable";
import { type CoursesAuthorResponseData } from "@o4s/generated-wundergraph/models";

type Courses = CoursesAuthorResponseData["courses"];

const CoursesList: React.FC<{
	productId: string | undefined;
	courses: Courses | undefined;
}> = ({ productId, courses }) => {

	return (
		<>
			{courses ? (

				<div className="w-full">
					{courses?.length === 0 ? (
						<span>There are no courses!</span>
					) : (
						<ProductCoursesTable productId={productId} courses={courses} />
					)}
				</div>

			) : (
				<Loading />
			)}
		</>
	)
}

export default CoursesList;