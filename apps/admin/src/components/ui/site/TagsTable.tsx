/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef, useState } from 'react';
import { DataTable, type DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { type BlogTagsResponseData } from "@o4s/generated-wundergraph/models";
import slugify from "@sindresorhus/slugify";
import useUpdateTagMutation from '~/hooks/useUpdateTagMutation';
import useDeleteTagMutation from '~/hooks/useDeleteTagMutation';

type Tags = BlogTagsResponseData["tags"];

const TagsTable: React.FC<{
  tags: Tags | undefined;
}> = ({ tags }) => {

	const toast = useRef<Toast>(null);
	const [deleteTagDialog, setDeleteTagDialog] = useState<boolean>(false);
	const [tagToDelete, setTagToDelete] = useState<string>("");
	const updateTag = useUpdateTagMutation();
	const deleteTag = useDeleteTagMutation();

	const confirmDeleteTag = (id: string) => {
		setTagToDelete(id);
		setDeleteTagDialog(true);
	};

	const deleteTagBodyTemplate = (rowData) => {
		return <Button
							onClick={() => confirmDeleteTag(rowData.id)}
							icon="pi pi-trash" rounded text
							severity="danger" 
							className="hover:bg-gray-200" aria-label="Delete" />;
	};

	const hideDeleteTagDialog = () => {
		setDeleteTagDialog(false);
	};

	const confirmedDeleteTag = async () => {

		setDeleteTagDialog(false);
		const deleted = await deleteTag.trigger(
			{
				id: tagToDelete
			}, { throwOnError: false });

		if (!deleted) {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		} else {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Tag deleted successfully', life: 3000});
		}

		setTagToDelete("");
	};

	const deleteTagDialogFooter = (
		<React.Fragment>
				<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteTagDialog} />
				<Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmedDeleteTag} />
		</React.Fragment>
	);

  const onTagRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const { newData, index } = e;

		const updated = await updateTag.trigger(
			{
				id: newData.id,
				name: newData.name,
				slug: slugify(newData.slug),
				description: newData.description,
				meta_title: newData.meta_title,
				meta_description: newData.meta_description,
			}, { throwOnError: false })

		if (!updated) {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		} else {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Tag updated successfully', life: 3000});
		}

  };

  const textEditor = (options) => {
    return <InputText className="w-full" type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)} />;
  };

  return (
		<><Toast ref={toast} />
		<div className="card pt-2">
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
				<Column style={{ width: '3%', minWidth: '3rem' }} body={deleteTagBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
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
		</div>
		</>
  );
};

export default TagsTable;