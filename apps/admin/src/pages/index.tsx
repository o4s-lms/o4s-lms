import SectionWrapper from "~/components/SectionWrapper";

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import CoursesList from "~/components/ui/courses/CoursesList";
import Stats from "~/components/ui/home/Stats";

const Home = () => {

	return (
		<><Header title="Cursos - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<Stats />
				<CoursesList />
			</SectionWrapper>
		</>
	);
};

export default Home;