import { useQuery } from "@/lib/wundergraph"

function useSiteCoursesQuery() {

	const getSiteCourses = useQuery({
		operationName: 'site/get-courses',
		inputs: {
			locale: 'pt',
	})

	const trigger: typeof getSiteCourses.trigger = async (input, options) => {
		return await getSiteCourses.trigger(input, options)
	}

	return {
		...getSiteCourses,
		trigger,
	}
}

export default useSiteCoursesQuery;