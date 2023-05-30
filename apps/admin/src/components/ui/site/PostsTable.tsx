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
import { type BlogPosts_allResponseData } from "@o4s/generated-wundergraph/models";
import slugify from "@sindresorhus/slugify";
import useUpdatePostMutation from '~/hooks/useUpdatePostMutation';
import useDeletePostMutation from '~/hooks/useDeletePostMutation';

type Posts = BlogPosts_allResponseData["posts"];

const PostsTable: React.FC<{
  posts: Posts | undefined;
}> = ({ posts }) => {

	const toast = useRef<Toast>(null);
	const [deletePostDialog, setDeletePostDialog] = useState<boolean>(false);
	const [postToDelete, setPostToDelete] = useState<string>("");
	const updatePost = useUpdatePostMutation();
	const deletePost = useDeletePostMutation();

	const confirmDeletePost = (id: string) => {
		setPostToDelete(id);
		setDeletePostDialog(true);
	};

	const deletePostBodyTemplate = (rowData) => {
		return <Button
							onClick={() => confirmDeletePost(rowData.id)}
							icon="pi pi-trash" rounded text
							severity="danger" 
							className="hover:bg-gray-200" aria-label="Delete" />;
	};

	const hideDeletePostDialog = () => {
		setDeletePostDialog(false);
	};

	const confirmedDeletePost = async () => {

		setDeletePostDialog(false);
		const deleted = await deletePost.trigger(
			{
				id: postToDelete
			}, { throwOnError: false });

		if (!deleted) {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		} else {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Post deleted successfully', life: 3000});
		}

		setPostToDelete("");
	};

	const deletePostDialogFooter = (
		<React.Fragment>
				<Button label="No" icon="pi pi-times" outlined onClick={hideDeletePostDialog} />
				<Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmedDeletePost} />
		</React.Fragment>
	);

  const onPostRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const { newData, index } = e;

		const updated = await updatePost.trigger(
			{
				id: newData.id,
				title: newData.title,
				slug: slugify(newData.title),
				excerpt: newData.excerpt,
				meta_title: newData.meta_title,
				meta_description: newData.meta_description,
			}, { throwOnError: false })

		if (!updated) {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		} else {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Post updated successfully', life: 3000});
		}

  };

  const textEditor = (options) => {
    return <InputText className="w-full" type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)} />;
  };

  return (
		<><Toast ref={toast} />
		<div className="card pt-2">
			<DataTable value={posts}
									editMode="row"
									dataKey="id"
									onRowEditComplete={onPostRowEditComplete}
                 	tableStyle={{ minWidth: '60rem' }}>
				<Column field="id" header="#" style={{ width: '10%' }} />
        <Column field="title" header="Title" editor={(options) => textEditor(options)} style={{ width: '15%' }} />
				<Column field="excerpt" header="Excerpt" editor={(options) => textEditor(options)} style={{ width: '20%' }} />
				<Column field="meta_title" header="Meta Title" editor={(options) => textEditor(options)} style={{ width: '15%' }} />
				<Column field="meta_description" header="Meta Description" editor={(options) => textEditor(options)} style={{ width: '20%' }} />
				<Column rowEditor headerStyle={{ width: '5%', minWidth: '5rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
				<Column style={{ width: '3%', minWidth: '3rem' }} body={deletePostBodyTemplate} bodyStyle={{ textAlign: 'center' }}/>
      </DataTable>
			<Dialog visible={deletePostDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletePostDialogFooter} onHide={hideDeletePostDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            {postToDelete && (
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

export default PostsTable;