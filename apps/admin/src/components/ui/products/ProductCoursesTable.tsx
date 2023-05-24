/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Toast } from "primereact/toast";
import { type CoursesAuthorResponseData } from '@o4s/generated-wundergraph/models';
import useRemoveCourseProductMutation from '~/hooks/useRemoveCourseProductMutation'
import useAddCourseProductMutation from '~/hooks/useAddCourseProductMutation'
import { useQuery } from '~/utils/wundergraph';
import Loading from '../Loading';

type Courses = CoursesAuthorResponseData["courses"];
type Course = CoursesAuthorResponseData["courses"][number];

const ProductCoursesTable: React.FC<{
	productId: number | undefined;
	courses: Courses;
}> = ({ productId, courses }) => {
		const toast = useRef<Toast>(null);
		const [coursesToAdd, setCoursesToAdd] = useState<Courses>([]);
		const removeCourse = useRemoveCourseProductMutation();
		const addCourse = useAddCourseProductMutation();

    //const formatCurrency = (value: number) => {
    //    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //};

		const { data, error, isLoading, mutate } = useQuery({
			operationName: 'courses/author',
			enabled: true
		});

		useEffect(() => {
			void mutate();
		}, [mutate]);

		if (error) {
			<p>{error.message}</p>
		};

		function removeObjectsWithId(out: Courses, inCourse: Courses) {
			inCourse.forEach(i => {
				const objWithIdIndex = out.findIndex((obj) => obj.id === i.id);
				if (objWithIdIndex > -1) {
					out.splice(objWithIdIndex, 1);
				}
			})
		
			return out;
		};

		useEffect(() => {
			const out = removeObjectsWithId(data?.courses, courses);
			setCoursesToAdd(out);
		}, [courses, data?.courses]);

    const imageBodyTemplate = (course: Course) => {
        return <img src={`${course.image}`} alt={course.name} className="w-6rem shadow-2 border-round" />;
    };

    /**const priceBodyTemplate = (course: Course) => {
        return formatCurrency(course.price);
    };

    const ratingBodyTemplate = (course: Course) => {
        return <Rating value={course.rating} readOnly cancel={false} />;
    };*/

    const statusBodyTemplate = (course: Course) => {
				return <Tag value={course.published ? 'Published' : 'Draft'} severity={getSeverity(course)}></Tag>;
    };

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

		function remove(id: any) {
			if (typeof id === 'number' && typeof productId === 'number') {
				void removeCourse.trigger({ productId: productId, courseId: id }, { throwOnError: false })
			}
			toast.current?.show({severity:'success', summary: 'Success', detail:'Course removed successfully', life: 3000});
		};

		const removeBodyTemplate = (rowData) => {
			return <Button
								onClick={() => remove(rowData.id)}
								icon="pi pi-trash" rounded text
								severity="danger" 
								className="hover:bg-gray-200" aria-label="Delete" />;
		};

    const inHeader = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Courses included in product</span>
            <Button icon="pi pi-refresh" rounded raised />
        </div>
    );
    const inFooter = `In total there are ${courses ? courses.length : 0} courses.`;

		function add(id: any) {
			if (typeof id === 'number' && typeof productId === 'number') {
				void addCourse.trigger({ productId: productId, courseId: id }, { throwOnError: false })
			}
			toast.current?.show({severity:'success', summary: 'Success', detail:'Course added successfully', life: 3000});
		}

		const addBodyTemplate = (rowData) => {
			return <Button
								onClick={() => add(rowData.id)}
								icon="pi pi-plus" rounded text
								severity="success" 
								className="hover:bg-gray-200" aria-label="Add" />;
		};

		const outHeader = (
			<div className="flex flex-wrap align-items-center justify-content-between gap-2">
					<span className="text-xl text-900 font-bold">Courses not included in product</span>
					<Button icon="pi pi-refresh" rounded raised />
			</div>
		);
		const outFooter = `In total there are ${courses ? courses.length : 0} courses.`;

    return (
				<><Toast ref={toast} />
        <div className="card">
            <DataTable value={courses} header={inHeader} footer={inFooter} tableStyle={{ minWidth: '60rem' }}>
                <Column field="name" header="Name"></Column>
                <Column header="Image" body={imageBodyTemplate}></Column>            
                <Column header="Status" body={statusBodyTemplate}></Column>
								<Column style={{ width: '3%', minWidth: '3rem' }} body={removeBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
            </DataTable>
        </div>
				{!isLoading ? (
					<div className="card">
							<DataTable value={coursesToAdd} header={outHeader} footer={outFooter} tableStyle={{ minWidth: '60rem' }}>
									<Column field="name" header="Name"></Column>
									<Column header="Image" body={imageBodyTemplate}></Column>            
									<Column header="Status" body={statusBodyTemplate}></Column>
									<Column style={{ width: '3%', minWidth: '3rem' }} body={addBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
							</DataTable>
					</div>
				) : (
					<Loading />
				)}
				</>
    );
};

export default ProductCoursesTable;