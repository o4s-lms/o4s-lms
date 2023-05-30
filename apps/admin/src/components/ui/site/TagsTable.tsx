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
import { api } from '~/utils/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { type BlogTagsResponseData } from "@o4s/generated-wundergraph/models";
import slugify from "@sindresorhus/slugify"
import useUpdateTagMutation from '~/hooks/useUpdateTagMutation';
import useAddTagMutation from '~/hooks/useAddTagMutation';
import useDeleteTagMutation from '~/hooks/useDeleteTagMutation';

type Tag = BlogTagsResponseData["tags"][number];
type Tags = BlogTagsResponseData["tags"];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
};

const TagsTable: React.FC<{
  tags: Tags | undefined;
}> = ({ tags }) => {

	const toast = useRef<Toast>(null);
	const [deleteModuleDialog, setDeleteModuleDialog] = useState<boolean>(false);
	const [module, setModule] = useState<ModuleDTO>(emptyModule);
	const [moduleToDelete, setModuleToDelete] = useState<number>(0);
	const [moduleToInsert, setModuleToInsert] = useState<number>(0);
	const [moduleDialog, setModuleDialog] = useState<boolean>(false);
	const [submittedModule, setModuleSubmitted] = useState<boolean>(false);
	const [lesson, setLesson] = useState<LessonDTO>(emptyLesson);
	const [lessonDialog, setLessonDialog] = useState<boolean>(false);
	const [submittedLesson, setLessonSubmitted] = useState<boolean>(false);
  const [statuses] = useState<string[]>(['published', 'draft']);
	const [name, setName] = useState("");
  const [description, setDescription] = useState("");
	const updateTag = useUpdateTagMutation()
	const addTag = useAddTagMutation()
	const deleteTag = useDeleteTagMutation()

	const utils = api.useContext();

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

	const saveModule = () => {
		setModuleSubmitted(true);

		if (module.name.trim()) {
				let _module = { ...module };

				setModuleDialog(false);
				setModule(emptyModule);
				createModule.mutate({
					courseId: _module.courseId,
					name: _module.name,
				});

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

	const createModule = api.module.create.useMutation({
    async onSuccess() {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Module created successfully', life: 3000});
      await utils.course.byId.invalidate();
    },
		onError(error) {
			console.error(error);
      toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		},
  });

	const onModuleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || '';
		let _module = { ...module };

		_module[`${name}`] = val;

		setModule(_module);
	};

	/** End add a module */

	/** Delete a module */

	const confirmDeleteModule = (id: number) => {
		setModuleToDelete(id);
		setDeleteModuleDialog(true);
	};

	const deleteModuleBodyTemplate = (rowData) => {
		return <Button
							onClick={() => confirmDeleteModule(rowData.id)}
							icon="pi pi-trash" rounded text
							severity="danger" 
							className="hover:bg-gray-200" aria-label="Delete" />;
	};

	const hideDeleteModuleDialog = () => {
		setDeleteModuleDialog(false);
	};

	const confirmedDeleteModule = () => {

		setDeleteModuleDialog(false);
		setModuleToDelete(0);
		deleteModule.mutate(moduleToDelete);
	};

	const deleteModuleDialogFooter = (
		<React.Fragment>
				<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteModuleDialog} />
				<Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmedDeleteModule} />
		</React.Fragment>
	);

	const deleteModule = api.module.delete.useMutation({
    async onSuccess() {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Lesson deleted successfully', life: 3000});
      await utils.course.byId.invalidate();
    },
		onError: (error) => {
			console.error(error);
			toast.current?.show({severity:'error', summary: 'Error', detail:`${error}`, life: 6000});
		},
  });

	/** End delete a module */

	/** Add a tag */
	const hideTagDialog = () => {
		setLessonSubmitted(false);
		setLessonDialog(false);
	};

	const addLessonBodyTemplate = (rowData) => {
		return <Button
							onClick={() => openNewLesson(rowData.moduleId)}
							icon="pi pi-plus" rounded text
							severity="warning" 
							className="hover:bg-gray-200" aria-label="Add" />;
	};

	const openNewLesson = (moduleId: number) => {
		setModuleToInsert(moduleId);
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

	const addTag = () => {
		setLessonSubmitted(true);

		if (lesson.name.trim()) {
				let _lesson = { ...lesson };

				setLessonDialog(false);
				setLesson(emptyLesson);
				createLesson.mutate({
					courseId: _lesson.courseId,
					moduleId: moduleToInsert,
					name: _lesson.name,
				});

		}

		void addTag.trigger(
			{
				id: newData.id,
				name: newData.name,
				slug: slugify(newData.slug),
				description: newData.description,
				meta_title: newData.meta_title,
				meta_description: newData.meta_description,
			}, { throwOnError: false })
	};

	const tagDialogFooter = (
		<React.Fragment>
				<Button label="Cancel" icon="pi pi-times" outlined onClick={hideTagDialog} />
				<Button label="Save" icon="pi pi-check" onClick={addTag} />
		</React.Fragment>
	);

  const onTagRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const { newData, index } = e;

		void updateTag.trigger(
			{
				id: newData.id,
				name: newData.name,
				slug: slugify(newData.slug),
				description: newData.description,
				meta_title: newData.meta_title,
				meta_description: newData.meta_description,
			}, { throwOnError: false })

  };

  const textEditor = (options) => {
    return <InputText className="w-full" type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)} />;
  };

	const deleteBodyTemplate = (rowData) => {
		return <Button
							onClick={() => confirm(rowData.id)}
							icon="pi pi-trash" rounded text
							severity="danger" 
							className="hover:bg-gray-200" aria-label="Delete" />;
	};

	/**
	const rowClass = (data: Product) => {
		return {
				'bg-primary': data.category === 'Fitness'
		};
	};
	 */

  return (
		<><Toast ref={toast} />
		<div className="card">
			<Toolbar className="mb-4" left={leftModuleToolbarTemplate} right={rightModuleToolbarTemplate}></Toolbar>
			<DataTable value={tags}
									editMode="row"
									dataKey="id"
									onRowEditComplete={onTagRowEditComplete}
                 	tableStyle={{ minWidth: '60rem' }}>
				<Column field="id" header="#" style={{ width: '10%' }} />
        <Column field="name" header="Name" editor={(options) => textEditor(options)} style={{ width: '15%' }} />
				<Column field="description" header="Description" editor={(options) => textEditor(options)} style={{ width: '20%' }} />
				<Column field="meta_title" header="Meta Title" editor={(options) => textEditor(options)} style={{ width: '15%' }} />
				<Column field="meta_description" header="Meta Description" editor={(options) => textEditor(options)} style={{ width: '20%' }} />
				<Column rowEditor headerStyle={{ width: '5%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
				<Column style={{ width: '3%', minWidth: '3rem' }} body={deleteModuleBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
      </DataTable>
			<Dialog visible={deleteTagDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteTagDialogFooter} onHide={hideDeleteTagDialog}>
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
          <InputText id="name" value={module.name} onChange={(e) => onModuleInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submittedModule && !module.name })} />
          {submittedModule && !module.name && <small className="p-error">Name is required.</small>}
        </div>
				<div className="field">
          <InputText id="description" value={module.name} onChange={(e) => onModuleInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submittedModule && !module.name })} />
          {submittedModule && !module.name && <small className="p-error">Name is required.</small>}
        </div>
      </Dialog>
		</div>
		</>
  );
};

export default TagsTable;