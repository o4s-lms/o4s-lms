import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { type CoursesAuthorResponseData } from '@o4s/generated-wundergraph/models';

type Course = CoursesAuthorResponseData["courses"][number];

const ProductCoursesTable: React.FC<{
	courses: CoursesAuthorResponseData["courses"];
}> = ({ courses }) => {

    const [products, setProducts] = useState<Product[]>([]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const imageBodyTemplate = (course: Course) => {
        return <img src={`${course.image}`} alt={product.name} className="w-6rem shadow-2 border-round" />;
    };

    const priceBodyTemplate = (course: Course) => {
        return formatCurrency(course.price);
    };

    const ratingBodyTemplate = (course: Course) => {
        return <Rating value={course.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (course: Course) => {
        return <Tag value={course.published} severity={getSeverity(course)}></Tag>;
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

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Courses</span>
            <Button icon="pi pi-refresh" rounded raised />
        </div>
    );
    const footer = `In total there are ${courses ? courses.length : 0} courses.`;

    return (
        <div className="card">
            <DataTable value={courses} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                <Column field="name" header="Name"></Column>
                <Column header="Image" body={imageBodyTemplate}></Column>
                <Column field="price" header="Price" body={priceBodyTemplate}></Column>
                <Column field="category" header="Category"></Column>
                <Column field="rating" header="Reviews" body={ratingBodyTemplate}></Column>
                <Column header="Status" body={statusBodyTemplate}></Column>
            </DataTable>
        </div>
    );
};

export default ProductCoursesTable;