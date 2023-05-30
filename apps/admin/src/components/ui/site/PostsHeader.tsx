import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Dialog } from "primereact/dialog";
import React from "react";
import useAddPostMutation from '~/hooks/useAddPostMutation';
import { InputText } from "primereact/inputtext";
import slugify from "@sindresorhus/slugify";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
};

const PostsHeader = () => {
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const [postDialog, setPostDialog] = useState<boolean>(false);
	const [submittedPost, setPostSubmitted] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const addPost = useAddPostMutation();

	/** Add a post */
	const hidePostDialog = () => {
		setPostSubmitted(false);
		setPostDialog(false);
	};

	const showPostDialog = () => {
		setPostDialog(true);
	};

	const onPostInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || '';

		setName(val);
	};

	const submitPost = async () => {
		setPostSubmitted(true);

		if (!name.trim()) {
			return null;
		}
		
		const postAdded = await addPost.trigger(
				{
					name: name,
					slug: slugify(name),
				}, { throwOnError: false });

		if (!postAdded) {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		} else {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Post added successfully', life: 3000});
			setName("");
			setPostDialog(false);
		}
	};

	const postDialogFooter = (
		<React.Fragment>
				<Button label="Cancel" icon="pi pi-times" outlined onClick={hidePostDialog} />
				<Button label="Save" icon="pi pi-check" onClick={submitPost} />
		</React.Fragment>
	);

	return (
		<><Toast ref={toast} />
			<Dialog visible={postDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Create blog post" modal className="p-fluid" footer={postDialogFooter} onHide={hidePostDialog}>
        <div className="field">
          <InputText id="name" value={name} onChange={(e) => onPostInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submittedPost && !name })} />
          {submittedPost && !name && <small className="p-error">Name is required.</small>}
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
						<span className="text-900 line-height-3">Blog Posts</span>
					</li>
				</ul>
				<div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
					<div>
						<div className="font-medium text-3xl text-900"> </div>
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
						<Button onClick={showPostDialog} label="Add" className="p-button-outlined mr-2" icon="pi pi-user-plus" />
					</div>
				</div>
			</div>
		</>
	)
};

export default PostsHeader;