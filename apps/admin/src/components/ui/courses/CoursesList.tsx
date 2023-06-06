/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import Image from "next/image";
import { useQuery } from '~/utils/wundergraph';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/router';
import Loading from '~/components/ui/Loading';
import { type CoursesAuthorResponseData } from '@o4s/generated-wundergraph/models';
import { minioImage } from '~/utils/image';
import { getCookie } from 'cookies-next';

type Course = CoursesAuthorResponseData["courses"][number];

const CoursesList = () => {
	const router = useRouter();
	const [layout, setLayout] = useState('grid');
	/**const { data: courses, error, isLoading } = useQuery({
		operationName: 'courses/author',
	});

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		throw new Error(error.message);
	}*/

	// const courses = api.course.byAuthor.useQuery();

	const { data, error, isLoading } = useQuery({
		operationName: 'courses/author',
		enabled: true,
	});

	if (error) {
		return (
			<><p>{error?.message}</p></>
		);
	}

	const getSeverity = (course: Course) => {
		switch (course.published) {
			case true:
				return 'success';

			case false:
				return 'danger';

			default:
				return null;
		}
	};

	const listItem = (course: Course) => {
		return (
			<div className="col-12">
				<div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
					<Image src={minioImage(course.image)} alt={course.name} width={205} height={201} className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" />
					<div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
						<div className="flex flex-column align-items-center sm:align-items-start gap-3">
							<div className="text-2xl font-bold text-900">{course.name}</div>
							<div className="text-900">{course.description}</div>
						</div>
						<div className="flex align-items-center gap-3">
							<Tag value={course.published ? ("Published") : ("Draft")} severity={getSeverity(course)}></Tag>
						</div>
						<div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
							<span className="font-semibold">M: {course._count.modules}</span>
							<span className="font-semibold">L: {course._count.lessons}</span>
							<span className="font-semibold">S: {course._count.members}</span>
							<Button onClick={() => router.push(`/courses/${course.id}`)} icon="pi pi-arrow-right" className="p-button-rounded" ></Button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const gridItem = (course: Course) => {
		return (
			<div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
				<div className="p-4 border-1 surface-border surface-card border-round">
					<div className="flex flex-wrap align-items-center justify-content-between gap-2">
						<Tag value={course.published ? ("Published") : ("Draft")} severity={getSeverity(course)}></Tag>
					</div>
					<div className="flex flex-column align-items-center gap-3 py-5">
						<Image className="w-9 shadow-2 border-round" src={minioImage(course.image)} alt={course.name} width={205} height={201} />
						<div className="text-2xl font-bold">{course.name}</div>
						<div className="text-900">{course.description}</div>
					</div>
					<div className="flex align-items-center justify-content-between">
						<span className="font-semibold">M: {course._count.modules}</span>
						<span className="font-semibold">L: {course._count.lessons}</span>
						<span className="font-semibold">S: {course._count.members}</span>
						<Button onClick={() => router.push(`/courses/${course.id}`)} icon="pi pi-arrow-right" className="p-button-rounded" ></Button>
					</div>
				</div>
			</div>
		);
	};

	const itemTemplate = (course: Course, layout: string) => {
		if (!course) {
			return;
		}

		if (layout === 'list') return listItem(course);
		else if (layout === 'grid') return gridItem(course);
	};

	const header = () => {
		return (
			<div className="flex justify-content-end">
				<DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
			</div>
		);
	};

	return (
		<>
			{!isLoading ? (
				<div className="card">
					{data?.courses ? (
						<DataView value={data.courses} itemTemplate={itemTemplate} layout={layout} header={header()} />
					) : (
						<p>No courses</p>
					)}
				</div>
			) : (
				<Loading />
			)}
		</>
	);
};

export default CoursesList;
