import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Dialog } from "primereact/dialog";
import React from "react";
import useAddTagMutation from '~/hooks/useAddTagMutation';
import { InputText } from "primereact/inputtext";
import slugify from "@sindresorhus/slugify";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
};

const TagsHeader = () => {
	const router = useRouter();
	const toast = useRef<Toast>(null);
	const [tagDialog, setTagDialog] = useState<boolean>(false);
	const [submittedTag, setTagSubmitted] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const addTag = useAddTagMutation();

	/** Add a tag */
	const hideTagDialog = () => {
		setTagSubmitted(false);
		setTagDialog(false);
	};

	const showTagDialog = () => {
		setTagDialog(true);
	};

	const onTagInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || '';

		setName(val);
	};

	const submitTag = async () => {
		setTagSubmitted(true);

		if (!name.trim()) {
			return null;
		}
		
		const tagAdded = await addTag.trigger(
				{
					name: name,
					slug: slugify(name),
				}, { throwOnError: false });

		if (!tagAdded) {
			toast.current?.show({severity:'error', summary: 'Error', detail:'Something went wrong', life: 3000});
		} else {
			toast.current?.show({severity:'success', summary: 'Success', detail:'Tag added successfully', life: 3000});
			setName("");
			setTagDialog(false);
		}
	};

	const tagDialogFooter = (
		<React.Fragment>
				<Button label="Cancel" icon="pi pi-times" outlined onClick={hideTagDialog} />
				<Button label="Save" icon="pi pi-check" onClick={submitTag} />
		</React.Fragment>
	);

	return (
		<><Toast ref={toast} />
			<Dialog visible={tagDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Create blog tag" modal className="p-fluid" footer={tagDialogFooter} onHide={hideTagDialog}>
        <div className="field">
          <InputText id="name" value={name} onChange={(e) => onTagInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submittedTag && !name })} />
          {submittedTag && !name && <small className="p-error">Name is required.</small>}
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
						<span className="text-900 line-height-3">Blog Tags</span>
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
						<Button onClick={showTagDialog} label="Add" className="p-button-outlined mr-2" icon="pi pi-user-plus" />
					</div>
				</div>
			</div>
		</>
	)
};

export default TagsHeader;