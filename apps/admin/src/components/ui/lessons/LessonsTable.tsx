/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef, useState } from 'react';
import { DataTable, type DataTableExpandedRows, type DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Toast } from "primereact/toast";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import slugify from '@sindresorhus/slugify';
import { type ModulesAllResponseData } from "@o4s/generated-wundergraph/models";
import useCreateModuleMutation from '~/hooks/useCreateModuleMutation';
import useCreateLessonMutation from '~/hooks/useCreateLessonMutation';
import useDeleteModuleMutation from '~/hooks/useDeleteModuleMutation';
import useDeleteLessonMutation from '~/hooks/useDeleteLessonMutation';
import useUpdateModuleMutation from '~/hooks/useUpdateModuleMutation';
import useUpdateLessonMutation from '~/hooks/useUpdateLessonMutation';
import CreateLessonForm from '~/components/forms/CreateLessonForm';

type Module = ModulesAllResponseData["modules"][number];
type Modules = ModulesAllResponseData["modules"];

type ModuleDTO = {
	course_id: string | undefined;
	name: string;
};

type LessonDTO = {
	course_id: string | undefined;
	module_id: string;
	name: string;
};

type ToDTO = {
	id: string;
	course_id: string;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
};

const LessonsTable: React.FC<{
  modules: Modules;
}> = ({ modules }) => {
	let emptyModule: ModuleDTO = {
		course_id: modules[0]?.course_id,
		name: '',
	};

	let emptyLesson: LessonDTO = {
		course_id: modules[0]?.course_id,
		module_id: '',
    name: '',
  };

	const toast = useRef<Toast>(null);
	const createModule = useCreateModuleMutation();
	const createLesson = useCreateLessonMutation();
	const deleteModule = useDeleteModuleMutation();
	const deleteLesson = useDeleteLessonMutation();
	const updateModule = useUpdateModuleMutation();
	const updateLesson = useUpdateLessonMutation();
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | undefined>(undefined);
	const [deleteModuleDialog, setDeleteModuleDialog] = useState<boolean>(false);
	const [module, setModule] = useState<ModuleDTO>(emptyModule);
	const [moduleToDelete, setModuleToDelete] = useState<ToDTO>({ id: '', course_id: '' });
	const [moduleToInsert, setModuleToInsert] = useState<string>('');
	const [moduleDialog, setModuleDialog] = useState<boolean>(false);
	const [submittedModule, setModuleSubmitted] = useState<boolean>(false);
	const [lesson, setLesson] = useState<LessonDTO>(emptyLesson);
	const [lessonToDelete, setLessonToDelete] = useState<ToDTO>({ id: '', course_id: '' });
	const [deleteLessonDialog, setDeleteLessonDialog] = useState<boolean>(false);
	const [lessonDialog, setLessonDialog] = useState<boolean>(false);
	const [submittedLesson, setLessonSubmitted] = useState<boolean>(false);
  const [statuses] = useState<string[]>(['published', 'draft']);

	/** Add a module */

	const hideModuleDialog = () => {
		setModuleSubmitted(false);
		setModuleDialog(false);
	};

	const leftModuleToolbarTemplate = () => {
		return (
				<div className="flex flex-wrap gap-2">
						<Button label="Module" icon="pi pi-plus" severity="success" onClick={openNewModule} />
				</div>
		);
	};

	const rightModuleToolbarTemplate = () => {
		return (
			<div className="flex flex-wrap justify-content-end gap-2">
				<Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
				<Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
			</div>
		)
	};

	const saveModule = async () => {
		setModuleSubmitted(true);

		if (module.name.trim()) {
				let _module = { ...module };

				setModuleDialog(false);
				setModule(emptyModule);
				const data = {
					name: _module.name,
					slug: slugify(_module.name),
					course_id: _module.course_id
				}
				const moduleCreated = await createModule.trigger(data, { throwOnError: false });
				if (moduleCreated) {
					toast.current?.show({severity:'success', summary: 'Success', detail:'Module created successfully', life: 3000});
				} else {
					toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
				}

		}
	};

	const moduleDialogFooter = (
		<React.Fragment>
				<Button label="Cancel" icon="pi pi-times" outlined onClick={hideModuleDialog} />
				<Button label="Save" icon="pi pi-check" onClick={saveModule} />
		</React.Fragment>
	);

	const openNewModule = () => {
		setModule(emptyModule);
		setModuleSubmitted(false);
		setModuleDialog(true);
	};

	const onModuleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || '';
		let _module = { ...module };

		_module[`${name}`] = val;

		setModule(_module);
	};

	/** End add a module */

	/** Delete a module */

	const confirmDeleteModule = (rowData) => {
		setModuleToDelete({ id: rowData.id, course_id: rowData.course_id });
		setDeleteModuleDialog(true);
	};

	const deleteModuleBodyTemplate = (rowData) => {
		return <Button
							onClick={() => confirmDeleteModule(rowData)}
							icon="pi pi-trash" rounded text
							severity="danger" 
							className="hover:bg-gray-200" aria-label="Delete" />;
	};

	const hideDeleteModuleDialog = () => {
		setDeleteModuleDialog(false);
	};

	const confirmedDeleteModule = async () => {

		setDeleteModuleDialog(false);
		const moduleDeleted = await deleteModule.trigger(moduleToDelete, { throwOnError: false });
		if (moduleDeleted) {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Module deleted successfully', life: 3000});
		} else {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		};
		setModuleToDelete({ id: '', course_id: '' });
	};

	const deleteModuleDialogFooter = (
		<React.Fragment>
				<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteModuleDialog} />
				<Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmedDeleteModule} />
		</React.Fragment>
	);

	/** End delete a module */

	/** Add a lesson 

	const leftLessonToolbarTemplate = () => {
		return (
				<div className="flex flex-wrap gap-2">
						<Button label="Module" icon="pi pi-plus" severity="success" onClick={openNewLesson} />
				</div>
		);
	};*/

	const hideLessonDialog = () => {
		setLessonSubmitted(false);
		setLessonDialog(false);
	};

	const addLessonBodyTemplate = (rowData) => {
		return <Button
							onClick={() => openNewLesson(rowData.module_id)}
							icon="pi pi-plus" rounded text
							severity="warning" 
							className="hover:bg-gray-200" aria-label="Add" />;
	};

	const openNewLesson = (module_id: string) => {
		setModuleToInsert(module_id);
		setLesson(emptyLesson);
		setLessonSubmitted(false);
		setLessonDialog(true);
	};

	const onLessonInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || '';
		let _lesson = { ...lesson };

		_lesson[`${name}`] = val;

		setLesson(_lesson);
	};

	const saveLesson = async () => {
		setLessonSubmitted(true);

		if (lesson.name.trim()) {
				let _lesson = { ...lesson };

				setLessonDialog(false);
				setLesson(emptyLesson);
				const data = {
					name: _lesson.name,
					slug: slugify(_lesson.name),
					course_id: _lesson.course_id,
					module_id: moduleToInsert,
				}
				const lessonCreated = await createLesson.trigger(data, { throwOnError: false })
				if (lessonCreated) {
					toast.current?.show({severity:'success', summary: 'Success', detail:'Lesson created successfully', life: 3000});
				} else {
					toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
				}

		}
	};

	const lessonDialogFooter = (
		<React.Fragment>
				<Button label="Cancel" icon="pi pi-times" outlined onClick={hideLessonDialog} />
				<Button label="Save" icon="pi pi-check" onClick={saveLesson} />
		</React.Fragment>
	);

	/** End add lesson */

	/** Delete a lesson */

	const confirmDeleteLesson = (rowData) => {
		setLessonToDelete({ id: rowData.id, course_id: rowData.course_id });
		setDeleteLessonDialog(true);
	};

	const deleteLessonBodyTemplate = (rowData) => {
		return <Button
							onClick={() => confirmDeleteLesson(rowData)}
							icon="pi pi-trash" rounded text
							severity="danger" 
							className="hover:bg-gray-200" aria-label="Delete" />;
	};

	const hideDeleteLessonDialog = () => {
		setDeleteLessonDialog(false);
	};

	const confirmedDeleteLesson = async () => {

		setDeleteLessonDialog(false);
		const lessonDeleted = await deleteLesson.trigger(lessonToDelete, { throwOnError: false });
		if (lessonDeleted) {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Module deleted successfully', life: 3000});
		} else {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		};
		setLessonToDelete({ id: '', course_id: '' });
	};

	const deleteLessonDialogFooter = (
		<React.Fragment>
				<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteLessonDialog} />
				<Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmedDeleteLesson} />
		</React.Fragment>
	);

	/** End delete a lesson */

	const exportCSV = () => {
		dt.current.exportCSV();
	};

	const openInNewTab = (url: string) => {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
		if (newWindow) newWindow.opener = null
	}

  const getSeverity = (value: string) => {
    switch (value) {
      case 'published':
        return 'success';

      case 'draft':
        return 'danger';

      default:
        return null;
    }
  };

  const onLessonRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const { newData, index } = e;

		const data = {
			id: newData.id,
			name: newData.name,
			slug: slugify(newData.name),
			status: newData.status,
			course_id: modules[0]?.course_id as string,
		}
		const lessonUpdated = await updateLesson.trigger(data, { throwOnError: false });
		if (lessonUpdated) {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Lesson updated successfully', life: 3000});
		} else {
			toast.current?.show({severity:'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
		};
  };

	const onModuleRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
		const { newData, index } = e;

		const data = {
			id: newData.id,
			name: newData.name,
			slug: slugify(newData.name),
			course_id: modules[index]?.course_id
		};
		const moduleUpdated = await updateModule.trigger(data, { throwOnError: false });
		if (moduleUpdated) {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Module updated successfully', life: 3000});
		} else {
			toast.current?.show({severity:'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
		};

	};

  const textEditor = (options) => {
    return <InputText className="w-full" type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)} />;
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e: DropdownChangeEvent) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)}></Tag>;
  };

	const htmlBodyTemplate = (rowData) => {
		return <Button
							onClick={() => openInNewTab(`/courses/${rowData.course_id}/lessons/${rowData.id}`)}
							icon="pi pi-file-edit" rounded text
							severity="success"
							className="hover:bg-gray-200" aria-label="Delete" />;
	};

	const expandAll = () => {
		let _expandedRows: DataTableExpandedRows = {};

		modules.forEach((p) => (_expandedRows[`${p.id}`] = true));

		setExpandedRows(_expandedRows);
	};

	const collapseAll = () => {
			setExpandedRows(undefined);
	};

	const allowExpansion = (rowData: Module) => {
		return true;
		// return rowData.lessons.length > 0;
	};

	/**
	const rowClass = (data: Product) => {
		return {
				'bg-primary': data.category === 'Fitness'
		};
	};
	 */

	const setLessonOrder = (data) => {
		toast.current?.show({severity:'success', summary: 'Success', detail: JSON.stringify(data), life: 3000});
		//setLessonOrder(data);
  };

	const setModuleOrder = (data) => {
		toast.current?.show({severity:'success', summary: 'Success', detail: JSON.stringify(data), life: 3000});
		//setLessonOrder(data);
  };

	const rowExpansionTemplate = (data: Module) => {
		return (
				<div className="p-1">
					<h5>Lessons for {data.name}</h5>
					{data.lessons?.length === 0 ? (
						<CreateLessonForm courseId={data.course_id} moduleId={data.id} />
					) : (
					<DataTable
							value={data.lessons}
							editMode="row"
							dataKey="id"
							onRowEditComplete={onLessonRowEditComplete}
							reorderableRows onRowReorder={(e) => setLessonOrder(e.value)}
							tableStyle={{ minWidth: '50rem' }}
						>
						<Column rowReorder style={{ width: '3%', minWidth: '3rem' }} />
						<Column field="id" header="_id" style={{ width: '5%' }}></Column>
						<Column field="pos" header="Pos" sortable style={{ width: '5%' }}></Column>
						<Column field="name" header="Lesson" editor={(options) => textEditor(options)} style={{ width: '45%' }}></Column>
						<Column field="status" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '10%' }}></Column>
						<Column rowEditor headerStyle={{ width: '10%', minWidth: '6rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
						<Column style={{ width: '3%', minWidth: '3rem' }} body={htmlBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
						<Column style={{ width: '3%', minWidth: '3rem' }} body={addLessonBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
						<Column style={{ width: '3%', minWidth: '3rem' }} body={deleteLessonBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
					</DataTable>
					)}
					<Dialog visible={deleteLessonDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteLessonDialogFooter} onHide={hideDeleteLessonDialog}>
						<div className="confirmation-content">
							<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
								{lesson && (
									<span>
										<b>Are you sure you want to delete?</b>
									</span>
								)}
						</div>
					</Dialog>
					<Dialog visible={lessonDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Create lesson" modal className="p-fluid" footer={lessonDialogFooter} onHide={hideLessonDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={lesson.name} onChange={(e) => onLessonInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submittedLesson && !lesson.name })} />
                    {submittedLesson && !lesson.name && <small className="p-error">Name is required.</small>}
                </div>
          </Dialog>

				</div>
		);
	};

  return (
		<><Toast ref={toast} />
		<div className="card">
			<Toolbar className="mb-4" left={leftModuleToolbarTemplate} right={rightModuleToolbarTemplate}></Toolbar>
			<DataTable value={modules}
									editMode="row"
									dataKey="id"
									onRowEditComplete={onModuleRowEditComplete}
									expandedRows={expandedRows}
									onRowToggle={(e) => setExpandedRows(e.data)}
									rowExpansionTemplate={rowExpansionTemplate}
									reorderableRows onRowReorder={(e) => setModuleOrder(e.value)}
                 	tableStyle={{ minWidth: '60rem' }}>
				<Column rowReorder style={{ width: '3%', minWidth: '3rem' }} />
        <Column expander={allowExpansion} style={{ width: '5rem' }} />
				<Column field="id" header="_id" style={{ width: '10%' }} />
				<Column field="pos" header="Pos" style={{ width: '10%' }} />
        <Column field="name" header="Module" editor={(options) => textEditor(options)} style={{ width: '65%' }} />
				<Column rowEditor headerStyle={{ width: '9%', minWidth: '6rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
				<Column style={{ width: '3%', minWidth: '3rem' }} body={deleteModuleBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
      </DataTable>
			<Dialog visible={deleteModuleDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteModuleDialogFooter} onHide={hideDeleteModuleDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            {module && (
              <span>
                <b>Are you sure you want to delete?</b>
              </span>
            )}
        </div>
      </Dialog>
			<Dialog visible={moduleDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Create module" modal className="p-fluid" footer={moduleDialogFooter} onHide={hideModuleDialog}>
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Module name
          </label>
          <InputText id="name" value={module.name} onChange={(e) => onModuleInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submittedModule && !module.name })} />
          {submittedModule && !module.name && <small className="p-error">Name is required.</small>}
        </div>
      </Dialog>
		</div>
		</>
  );
};

export default LessonsTable;