import { useRouter } from "next/router";
import { useQuery } from "~/utils/wundergraph";

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import LessonEditor from "~/components/ui/lessons/LessonEditor";
import LoadingEditor from "~/components/ui/lessons/LoadingEditor";

const EditLesson = () => {
	const router = useRouter();
  const query = router.query;

  const lessonId = query.lessonId;

	//if (typeof courseId !== "string") {
  //  throw new Error("missing id");
  //}

	// const lessonQuery = api.lesson.getContent.useQuery({ id });

	const { data, error, isLoading } = useQuery({
		operationName: 'lessons/id',
		input: {
			id: parseInt(lessonId),
		},
		enabled: true,
	});

	if (error) {
		return <p>{error.message}</p>;
	}

	return (
		<>
		{!isLoading ? (
			<><Header title={data?.lesson?.name} />
			<Nav />
			<LessonEditor
				lesson={data?.lesson}
			/>
			</>
		) : (
      <LoadingEditor />
    )}
		</>
	);
};

export default EditLesson;