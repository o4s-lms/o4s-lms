import { useRef } from "react";
import { useRouter } from "next/router";

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import SectionWrapper from "~/components/SectionWrapper";
import CourseHeader from "~/components/ui/courses/CourseHeader";
import Loading from "~/components/ui/Loading";
import ModulesList from "~/components/ui/modules/ModuleList";
import { Toast } from "primereact/toast";
import CreateModuleForm from "~/components/forms/CreateModuleForm";
import { useQuery } from "~/utils/wundergraph";

const ManageCourse = () => {
	const toast = useRef<Toast>(null);
	const { query: { courseId } } = useRouter();

	//if (typeof courseId !== "string") {
	//  throw new Error("missing id");
	//}

	const { data, error, isLoading } = useQuery({
		operationName: 'courses/id',
		input: {
			id: parseInt(courseId)
		},
		enabled: true,
	});

	if (error) {
		return <p>{error.message}</p>;
	}

	return (
		<><Toast ref={toast} />
			{!isLoading ? (
				<>
				{data?.course ? (
				<><Header title={data.course.name} />
					<Nav />
					<CourseHeader
							id={data.course.id}
							name={data.course.name}
							published={data.course.published}
					 />
					<SectionWrapper className="mt-0">
						{data?.course?.modules?.length === 0 ? (
							<CreateModuleForm courseId={data.course.id} />
						) : (
							<ModulesList modules={data.course.modules} />
						)}
					</SectionWrapper>
				</>			
				) : (
					<p>Course not found</p>
				)}
				</>
			) : (
				<Loading />
			)}
		</>
	);

};

export default ManageCourse;