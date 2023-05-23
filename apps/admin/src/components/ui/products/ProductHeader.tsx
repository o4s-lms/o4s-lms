import { useRouter } from "next/router";
import { useRef } from "react";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from 'primereact/toast';
import React from "react";
import { Dialog } from "primereact/dialog";

type Props = {
	id: number | undefined;
	name: string | undefined;
	image: string | undefined;
	active: boolean | undefined;
	onProductDelete: () => void;
}

const ProductHeader = ({ id, name, image, active, onProductDelete }: Props) => {
	const router = useRouter();
	const toast = useRef<Toast>(null);

	const hideDeleteProductDialog = () => {
		setDeleteCourseDialog(false);
	};

	const confirmDeleteProduct = () => {
		setDeleteProductDialog(true);
	};

	const confirmedDeleteProduct = () => {
		setDeleteProductDialog(false);
		void deleteProduct.trigger({ id: id }, { throwOnError: false });
		toast.current?.show({severity:'success', summary: 'Success', detail:'Product deleted successfully', life: 3000});
		void router.push('/products');
	};

	const deleteProductDialogFooter = (
		<React.Fragment>
				<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
				<Button label="Yes" icon="pi pi-check" severity="danger" onClick={confirmedDeleteProduct} />
		</React.Fragment>
	);

	return (
		<><Toast ref={toast} />
			<Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
						{module && (
							<span>
								<b>Are you sure you want to proceed?</b>
							</span>
						)}
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
						<a onClick={() => { void router.push('/products'); }} className="text-500 no-underline line-height-3 cursor-pointer">Products</a>
					</li>
					<li className="px-2">
						<i className="pi pi-angle-right text-500 line-height-3"></i>
					</li>
					<li>
						<span className="text-900 line-height-3">{name}</span>
					</li>
				</ul>
				<div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
					<div>
						<div className="font-medium text-3xl text-900">{id} : {name}</div>
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
						<Button label="Add" className="p-button-outlined mr-2" icon="pi pi-user-plus" />
						<Button
							onClick={confirm}
							label="Delete"
							severity="danger"
							className="p-button-outlined mr-2"
							icon="pi pi-trash" />
						<Button label={active ? ("Unactive") : ("Active")} icon="pi pi-check" />
					</div>
				</div>
			</div>
		</>
	)
};

export default ProductHeader;