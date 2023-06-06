/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import React from "react";
import { Dialog } from "primereact/dialog";
import useDeleteProductMutation from "~/hooks/useDeleteProductMutation";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { client } from "~/utils/wundergraph";
import { type CoursesAuthorResponseData } from '@o4s/generated-wundergraph/models';
import { type GetServerSideProps } from "next/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { removeObjectsWithId } from "@o4s/lib";
import useAddCourseProductMutation from "~/hooks/useAddCourseProductMutation";

type Courses = CoursesAuthorResponseData["courses"];
type Course = CoursesAuthorResponseData["courses"][number];

type Props = {
	id: string | undefined;
	title: string | undefined;
	image: string | undefined;
	active: boolean | undefined;
	coursesToAdd?: Courses | undefined;
}

const ProductHeader = ({ id, title, image, active, coursesToAdd }: Props) => {
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const [dialogVisible, setDialogVisible] = useState<boolean>(false);
	const deleteProduct = useDeleteProductMutation();
	const addCourse = useAddCourseProductMutation();
	const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);

	function add(courseId: any) {
		if (typeof id === 'number' && typeof courseId === 'number') {
			void addCourse.trigger({ productId: id, courseId: courseId }, { throwOnError: false })
		}
		toast.current?.show({severity:'success', summary: 'Success', detail:'Course added successfully', life: 3000});
	};

	const dialogFooterTemplate = () => {
		return <Button label="Ok" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
	};

	const addBodyTemplate = (rowData) => {
		return <Button
							onClick={() => add(rowData.id)}
							icon="pi pi-plus" rounded text
							severity="success" 
							className="hover:bg-gray-200" aria-label="Add" />;
	};

	const statusBodyTemplate = (course: Course) => {
		return <Tag value={course.published ? 'Published' : 'Draft'} severity={getSeverity(course.published)}></Tag>;
	};

	const imageBodyTemplate = (course: Course) => {
		return <img src={`${course.image}`} alt={course.name} className="w-6rem shadow-2 border-round" />;
	};

	const outHeader = (
		<div className="flex flex-wrap align-items-center justify-content-between gap-2">
				<span className="text-xl text-900 font-bold">Courses not included in product</span>
				<Button icon="pi pi-refresh" rounded raised />
		</div>
	);
	const outFooter = `In total there are ${coursesToAdd ? coursesToAdd.length : 0} courses.`;

	const hideDeleteProductDialog = () => {
		setDeleteProductDialog(false);
	};

	const confirmDeleteProduct = () => {
		setDeleteProductDialog(true);
	};

	const confirmedDeleteProduct = () => {
		setDeleteProductDialog(false);
		void deleteProduct.trigger({ id: id }, { throwOnError: false });
		toast.current?.show({severity:'success', summary: 'Success', detail:'Product deleted successfully', life: 3000});
		void router.push('/products');
	};

	const deleteProductDialogFooter = (
		<React.Fragment>
				<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
				<Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmedDeleteProduct} />
		</React.Fragment>
	);

	const getSeverity = (condition: boolean | undefined) => {
		switch (condition) {
				case true:
						return 'success';

				case false:
						return 'danger';

				default:
						return null;
		}
	};

	return (
		<><Toast ref={toast} />
			<Dialog header="Flex Scroll" visible={dialogVisible} style={{ width: '75vw' }} maximizable
              modal contentStyle={{ height: '300px' }} onHide={() => setDialogVisible(false)} footer={dialogFooterTemplate}>
        <DataTable value={coursesToAdd} header={outHeader} footer={outFooter} tableStyle={{ minWidth: '60rem' }}>
					<Column field="title" header="Title"></Column>
					<Column header="Image" body={imageBodyTemplate}></Column>            
					<Column header="Status" body={statusBodyTemplate}></Column>
					<Column style={{ width: '3%', minWidth: '3rem' }} body={addBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
				</DataTable>
      </Dialog>
			<Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
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
						<a onClick={() => { void router.push('/'); }} className="text-500 no-underline line-height-3 cursor-pointer">Home</a>
					</li>
					<li className="px-2">
						<i className="pi pi-angle-right text-500 line-height-3"></i>
					</li>
					<li>
						<a onClick={() => { void router.push('/products'); }} className="text-500 no-underline line-height-3 cursor-pointer">Products</a>
					</li>
					<li className="px-2">
						<i className="pi pi-angle-right text-500 line-height-3"></i>
					</li>
					<li>
						<span className="text-900 line-height-3">{title}</span>
					</li>
				</ul>
				<div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
					<div>
						<div className="font-medium text-3xl text-900">
							<div className="flex justify-between">
								<span className="px-3">
									<Tag className="padding-right" value={active ? 'Actived' : 'Desactived'} severity={getSeverity(active)}></Tag>
								</span>
								<Avatar 
									image={image}
									className="flex align-items-center justify-content-center mr-2" size="large" shape="circle"
								/>
								<span>{id} : {title}</span>
								
							</div>
						</div>
						<div className="flex align-items-center text-700 flex-wrap">
							<div className="mr-5 flex align-items-center mt-3">
								<i className="pi pi-users mr-2"></i>
								<span>332 Sales</span>
							</div>
							<div className="mr-5 flex align-items-center mt-3">
								<i className="pi pi-globe mr-2"></i>
								<span> ...</span>
							</div>
							<div className="flex align-items-center mt-3">
								<i className="pi pi-clock mr-2"></i>
								<span>EUR 9402 Revenue</span>
							</div>
						</div>
					</div>
					<div className="mt-3 lg:mt-0">
						<Button onClick={() => setDialogVisible(true)} label="Add Course" className="p-button-outlined mr-2" icon="pi pi-plus" />
						<Button
							onClick={confirmDeleteProduct}
							label="Delete"
							severity="danger"
							className="p-button-outlined mr-2"
							icon="pi pi-trash" />
						<Button label={active ? ("Unactive") : ("Active")} icon="pi pi-check" />
					</div>
				</div>
			</div>
		</>
	)
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await client.query({
		operationName: 'courses/author',
	});

  return {
    props: {
      coursesToAdd: data?.courses
    },
  };
};

export default ProductHeader;