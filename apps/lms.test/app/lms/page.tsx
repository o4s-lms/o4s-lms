"use client";

import Hero from "@/components/home/hero";
import CourseCard from "@/components/home/course-card";
import getSession from "@/app/actions/auth/get-session";
import { useQuery } from "@o4s/generated-wundergraph/nextjs";

export default async function Lms() {
	//const { authenticated } = await getToken();
	const session = await getSession();
	/** const coursesData = getData({
		operation: "courses/all",
		revalidate: 60,
		cache: "force-cache",
	}); 
	const client = createClient({
		customFetch: fetch,
		extraHeaders: {
			Authorization: `Bearer ${bearer}`,
		},
	});*/
	const { data, error, isLoading } = useQuery({
		operationName: 'courses/all',
	});

	if (!session) {
		/**const { data, error, isLoading } = useQuery({
			operationName: 'courses/all',
		});*/
		return (
			<div className="z-10 w-full max-w-xl px-5 xl:px-0">
				<Hero />

			</div>
		)
  }

	if (session) {
		//const [ data ] = await Promise.all([coursesData]);
		
		/** const { data, error } = await client.query({
			operationName: 'courses/all',
		}); */

		if (error) {
			throw new Error(error);
		}

		if (isLoading) {
			return <p>Loading...</p>;
		}
	
		return (
			<>
			<div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
					{data?.courses.map((course) => (
						<CourseCard key={course.id} name={course.name} description={course.description} image={course.image} />
					))}
			</div>
			</>
		)
  }
}
