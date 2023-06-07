import { useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import slugify from "@sindresorhus/slugify";
import useCreateLessonMutation from "~/hooks/useCreateLessonMutation";


const CreateLessonForm: React.FC<{
	courseId: string;
	moduleId: string;
}> = ({ courseId, moduleId }) => {
	const toast = useRef<Toast>(null);
	const createLesson = useCreateLessonMutation();
  const [name, setName] = useState('');

	const saveLesson = async () => {
		if (name.trim()) {
			const data = {
				name: name,
				slug: slugify(name),
				course_id: courseId,
				module_id: moduleId,
			}
			const lessonCreated = await createLesson.trigger(data, { throwOnError: false });
			if (lessonCreated) {
				toast.current?.show({severity:'success', summary: 'Success', detail:'Lesson created successfully', life: 3000});
			} else {
				toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
			};
			setName('');
		};
	};

  return (
		<><Toast ref={toast} />
    <div className="flex items-center border-b border-teal-500 pb-2">
			<InputText
				type="text"
				placeholder="Lesson name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="w-full" />
      {/**{error?.data?.zodError?.fieldErrors.name && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.name}
        </span>
			)}*/}
			<Button
				onClick={saveLesson}
				label="Lesson"
        icon="pi pi-plus"
        className="p-button-success"
			/>
    </div>
		</>
  );
};

export default CreateLessonForm;