/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableExpandedRows } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { type RouterOutputs } from '~/utils/api';

type Users = RouterOutputs["user"]["byUserRole"];

const FilterUsersTable: React.FC<{
	users: Users;
}> = ({ users }) => {
	const toast = useRef<Toast>(null);
	const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>(null);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
		date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
	});
	const [globalFilterValue, setGlobalFilterValue] = useState('');
	const [roles] = useState(['STUDENT', 'TEACHER', 'AUTHOR', 'ADMIN', 'OBSERVATOR']);

	const getSeverity = (role) => {
		switch (role) {
			case 'ADMIN':
				return 'danger';

			case 'STUDENT':
				return 'success';

			case 'TEACHER':
				return 'info';

			case 'AUTHOR':
				return 'warning';

			case 'OBSERVATOR':
				return null;
		}
	};

	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		const _filters = { ...filters };

		_filters['global'].value = value;

		setFilters(_filters);
		setGlobalFilterValue(value);
	};


	const formatDate = (value) => {
		// return value.substring(0,10);
		return value.toLocaleDateString('en-US', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	};

	const dateBodyTemplate = (rowData) => {
		return formatDate(rowData.user.emailVerified);
	};

	const dateFilterTemplate = (options) => {
		return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
	};

	const expandAll = () => {
		const _expandedRows: DataTableExpandedRows = {};

		users.forEach((p) => (_expandedRows[`${p.user.id}`] = true));

		setExpandedRows(_expandedRows);
	};

	const collapseAll = () => {
		setExpandedRows(null);
	};

	const allowExpansion = (rowData) => {
		//return true;
		return rowData.user.courses.length > 0;
	};

	const renderHeader = () => {
		return (
			<div className="flex flex-wrap gap-2 justify-content-between align-items-center">
				<h4 className="m-0">Users</h4>
				<div className="flex flex-wrap justify-content-end gap-2">
					<Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
					<Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
				</div>
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
				</span>
			</div>
		);
	};

	const imageBodyTemplate = (rowData) => {

		return (
			<div className="flex align-items-center gap-2">
				<img alt={rowData.user.name} src={rowData.user.image} width="32" />
			</div>
		);
	};

	const roleBodyTemplate = (rowData) => {
		return <Tag value={rowData.role} severity={getSeverity(rowData.role)} />;
	};

	const actionBodyTemplate = () => {
		return <Button type="button" icon="pi pi-cog" rounded></Button>;
	};

	const roleItemTemplate = (option) => {
		return <Tag value={option} severity={getSeverity(option)} />;
	};

	const header = renderHeader();

	const rowExpansionTemplate = (data) => {
		return (
			<div className="px-5">
				<h5>User Roles</h5>
				<DataTable
					value={data.user.courses}
					dataKey="courseId"
					tableStyle={{ minWidth: '50rem' }}
				>
					<Column field="courseId" header="#" style={{ width: '5%' }}></Column>
					<Column field="course.name" header="Course" style={{ width: '50%' }}></Column>
					<Column field="course.role" header="Role" style={{ minWidth: '12rem' }} body={roleBodyTemplate} />
				</DataTable>
			</div>
		);
	};

	return (
		<><Toast ref={toast} />
			<div className="card">
				<DataTable value={users} paginator header={header} rows={10}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					rowsPerPageOptions={[10, 25, 50]} dataKey="user.id" selectionMode="checkbox" selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
					expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate}
					filters={filters} filterDisplay="menu" globalFilterFields={['user.name', 'user.email']}
					emptyMessage="No users found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
					<Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
					<Column expander={allowExpansion} style={{ width: '3rem' }} />
					<Column field="user.image" style={{ minWidth: '3rem' }} body={imageBodyTemplate} />
					<Column field="user.name" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
					<Column field="user.email" header="Email" sortable filter filterPlaceholder="Search by email" style={{ minWidth: '14rem' }} />
					<Column field="user.emailVerified" header="Date" sortable filterField="date" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
					<Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
				</DataTable>
			</div>
		</>
	);

};

export default FilterUsersTable;