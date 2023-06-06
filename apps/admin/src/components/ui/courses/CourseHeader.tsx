import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Dialog } from "primereact/dialog";
import React from "react";
import useDeleteCourseMutation from '~/hooks/useDeleteCourseMutation';

type Props = {
	id: string;
	name: string;
	published: boolean;
}

const CourseHeader = ({ id, name, published }: Props) => {
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const deleteCourse = useDeleteCourseMutation();
	const [deleteCourseDialog, setDeleteCourseDialog] = useState<boolean>(false);

	const hideDeleteCourseDialog = () => {
		setDeleteCourseDialog(false);
	};

	const confirmDeleteCourse = () => {
		setDeleteCourseDialog(true);
	};

	const confirmedDeleteCourse = () => {
		setDeleteCourseDialog(false);
		void deleteCourse.trigger({ id: id }, { throwOnError: false });
		toast.current?.show({severity:'success', summary: 'Success', detail:'Course deleted successfully', life: 3000});
		void router.push('/');
	};

	const deleteCourseDialogFooter = (
		<React.Fragment>
				<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCourseDialog} />
				<Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmedDeleteCourse} />
		</React.Fragment>
	);

	return (
		<><Toast ref={toast} />
			<Dialog visible={deleteCourseDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCourseDialogFooter} onHide={hideDeleteCourseDialog}>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
						{module && (
							<span>
								<b>Are you sure you want to proceed?</b>
							</span>
						)}
				</div>
			</Dialog>
			<div className="surface-0">
				<ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
					<li>
						<a onClick={() => { void router.push('/'); }} className="text-500 no-underline line-height-3 cursor-pointer">Courses</a>
					</li>
					<li className="px-2">
						<i className="pi pi-angle-right text-500 line-height-3"></i>
					</li>
					<li>
						<span className="text-900 line-height-3">{name}</span>
					</li>
				</ul>
				<div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
					<div>
						<div className="font-medium text-3xl text-900">{id} : {name}</div>
						<div className="flex align-items-center text-700 flex-wrap">
							<div className="mr-5 flex align-items-center mt-3">
								<i className="pi pi-users mr-2"></i>
								<span>332 Active Users</span>
							</div>
							<div className="mr-5 flex align-items-center mt-3">
								<i className="pi pi-globe mr-2"></i>
								<span>9402 Sessions</span>
							</div>
							<div className="flex align-items-center mt-3">
								<i className="pi pi-clock mr-2"></i>
								<span>2.32m Avg. Duration</span>
							</div>
						</div>
					</div>
					<div className="mt-3 lg:mt-0">
						<Button label="Add" className="p-button-outlined mr-2" icon="pi pi-user-plus" />
						<Button
							onClick={confirmDeleteCourse}
							label="Delete"
							severity="danger"
							className="p-button-outlined mr-2"
							icon="pi pi-trash" />
						<Button label={published ? ("Unpublish") : ("Publish")} icon="pi pi-check" />
					</div>
				</div>
			</div>
		</>
	)
};

export default CourseHeader;
