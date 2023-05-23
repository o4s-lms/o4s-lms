/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Toast } from "primereact/toast";
import { type CoursesAuthorResponseData } from '@o4s/generated-wundergraph/models';
import useRemoveCourseProductMutation from '~/hooks/useRemoveCourseProductMutation'

type Course = CoursesAuthorResponseData["courses"][number];

const ProductCoursesTable: React.FC<{
	productId: number | undefined;
	courses: CoursesAuthorResponseData["courses"];
}> = ({ productId, courses }) => {
		const toast = useRef<Toast>(null);
		const removeCourse = useRemoveCourseProductMutation();

    /**const [products, setProducts] = useState<Product[]>([]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };*/

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
		}

		const removeBodyTemplate = (rowData) => {
			return <Button
								onClick={() => remove(rowData.id)}
								icon="pi pi-trash" rounded text
								severity="danger" 
								className="hover:bg-gray-200" aria-label="Delete" />;
		};

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Courses</span>
            <Button icon="pi pi-refresh" rounded raised />
        </div>
    );
    const footer = `In total there are ${courses ? courses.length : 0} courses.`;

    return (
				<><Toast ref={toast} />
        <div className="card">
            <DataTable value={courses} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                <Column field="name" header="Name"></Column>
                <Column header="Image" body={imageBodyTemplate}></Column>            
                <Column header="Status" body={statusBodyTemplate}></Column>
								<Column style={{ width: '3%', minWidth: '3rem' }} body={removeBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
            </DataTable>
        </div>
				</>
    );
};

export default ProductCoursesTable;