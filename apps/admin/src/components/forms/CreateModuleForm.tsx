import { useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import slugify from "@sindresorhus/slugify";
import useCreateModuleMutation from "~/hooks/useCreateModuleMutation";

const CreateModuleForm: React.FC<{ courseId: string; }> = ({ courseId }) => {
	const toast = useRef<Toast>(null);
	const createModule = useCreateModuleMutation();

	const [name, setName] = useState("");

	const saveModule = async () => {

		const data = {
			name: name,
			slug: slugify(name),
			course_id: courseId
		}
		const moduleCreated = await createModule.trigger(data, { throwOnError: false });
		if (moduleCreated) {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Module created successfully', life: 3000});
		} else {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		};
		setName("");
	};

	return (
		<><Toast ref={toast} />
			<div className="flex items-center border-b border-teal-500 py-2">
				<InputText
					type="text"
					placeholder="Create your first module..."
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full px-2" />
				 {/**{error?.data?.zodError?.fieldErrors.name && (
					<span className="mb-2 text-red-500">
						{error.data.zodError.fieldErrors.name}
				 </span>
				)}*/}
				<Button
					onClick={saveModule}
					label="Module"
					icon="pi pi-plus"
					className="p-button-success px-2"
				/>
			</div>
		</>
	);
};

export default CreateModuleForm;