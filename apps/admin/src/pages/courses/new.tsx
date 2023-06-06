/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import useAddCourseMutation from "~/hooks/useAddCourseMutation";
import slugify from "@sindresorhus/slugify";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from 'primereact/button';
import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import SectionWrapper from "~/components/SectionWrapper";
import { type NotificationPayload, sendToNotificationWebhook } from "~/utils/novu";
import { useFileUpload } from "~/utils/wundergraph";
import { z } from "zod";

const Upload = () => {

	const [files, setFiles] = useState<FileList>();
	const [data, setData] = useState<string[]>([]);

	const { upload } = useFileUpload({});

	let uploadProfile: 'images';

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) setFiles(e.target.files);
	};

	const onSubmit = async (e: React.FormEvent<Element>) => {
		e.preventDefault();
		if (!files) {
			return;
		}
		try {
			const result = await upload({
				provider: 'minio',
				profile: uploadProfile,
				files,
			});
			result && setData(result);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Upload failed!';
			alert(msg);
			console.error("Couldn't upload files", msg);
		}
	};

	return (
		<div>
			<form className="grid grid-cols-2 items-center gap-4 py-10" onSubmit={onSubmit}>
				<input
					className="col-span-2 border border-slate-500 rounded"
					id="multiple_files"
					type="file"
					multiple
					onChange={onFileChange}
				/>
				<button
					name="upload"
					className="col-span-1 bg-white text-black px-2 rounded"
					type="submit"
				>
					Upload
				</button>
				</form>
			<ul>
				{data.map((file) => (
					<li data-testid="result" className="text-center mt-8" key={file}>
						Uploaded as {file}
					</li>
				))}
			</ul>
		</div>
	);
};

const data = z.object({
  name: z.string().nonempty(),
	slug: z.string().nonempty(),
  description: z.string().nonempty(),
	image: z.string().nonempty(),
});

const CreateCourseForm: React.FC = () => {
	const createCourse = useAddCourseMutation();
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");

	const addCourse = async () => {
		const data = {
			name: name,
			slug: slugify(name),
			description: description,
			image: image,
		};
		const course = await createCourse.trigger(data, { throwOnError: false });
		if (course) {
			toast.current?.show({ severity: 'success', summary: 'Success', detail: `Course ${data.name} created successfully`, life: 3000 });
		} else {
			toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
		}
	}

	/**const { mutate, error } = api.course.create.useMutation({
		onSuccess(data) {
			setName("");
			setDescription("");
			setImage("");
			toast.current?.show({ severity: 'success', summary: 'Success', detail: `Course ${data.id} created successfully`, life: 6000 });
			const payload = {
				"eventId": "admin-notification",
				"to": {
					"subscriberId": `${session?.user.id as string}`,
				},
				"payload": {
					"message": "Curso criado com sucesso",
					"id": `${data.id as unknown as string}`,
					"name": `${data.name}`,
					"description": `${data.description}`,
				}
			};

			void sendToNotificationWebhook(payload);

		},
		onError(error) {
			console.error(error);
			toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
		},
	});*/

	return (
		<><Toast ref={toast} />
			<div className="card justify-content-center">
				<div className="field card flex">
					<span className="p-float-label">
						<InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
						<label htmlFor="name">Course name</label>
					</span>
				</div>
				{/**{error?.data?.zodError?.fieldErrors.name && (
					<span className="mb-2 text-red-500">
						{error.data.zodError.fieldErrors.name}
					</span>
				)}*/}
				<div className="field card flex">
					<span className="p-float-label">
						<InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} cols={30} />
						<label htmlFor="description">Description</label>
					</span>
				</div>
				{/**{error?.data?.zodError?.fieldErrors.description && (
					<span className="mb-2 text-red-500">
						{error.data.zodError.fieldErrors.description}
					</span>
				)}*/}
				<div className="field card flex">
					<span className="p-float-label">
						<InputText id="image" value={image} onChange={(e) => setImage(e.target.value)} />
						<label htmlFor="image">Image</label>
					</span>
				</div>
				{/**{error?.data?.zodError?.fieldErrors.image && (
					<span className="mb-2 text-red-500">
						{error.data.zodError.fieldErrors.image}
					</span>
				)}*/}

				<Upload />

				<div className="field card flex">
					<Button
						onClick={addCourse}
						label="Add new course" raised />
				</div>

			</div></>
	);
};

const NewCourse = () => {

	return (
		<><Header title="Create course - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<CreateCourseForm />
			</SectionWrapper>
		</>
	);
};

export default NewCourse;