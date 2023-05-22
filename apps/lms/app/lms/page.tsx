"use client";

import LoadingModal from "~/app/components/modals/LoadingModal";
import CourseCard from "./components/CourseCard";
import { client } from "~/app/lib/api";
import SectionWrapper from "~/app/components/layout/SectionWrapper";
import { useQuery } from "~/app/lib/react-query";

async function getCourses() {
	const { data, error } = await client.query({
		operationName: 'courses/all',
	});

	if (error) {
		return null;
	}

	return data;
}

const Lms = async () => {
	// const data = await getCourses();
	const { data } = useQuery({
		operationName: 'courses/all',
	});

	return data?.courses ? (
		<>
		<SectionWrapper>
		<div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
				{data?.courses.map((course) => (
					<CourseCard key={course.id} name={course.name} description={course.description} image={course.image} />
				))}
		</div>
		</SectionWrapper>
		</>
	) : <div>No courses found</div>;

}

export default Lms;