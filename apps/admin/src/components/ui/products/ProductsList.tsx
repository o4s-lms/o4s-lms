/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import Image from "next/image";
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/router';
import Loading from '../Loading';
import { type ProductsAllResponseData } from '@o4s/generated-wundergraph/models';
import { useQuery } from '~/utils/wundergraph';

type Product = ProductsAllResponseData["products"][number];

const ProductsList = () => {
	const router = useRouter();
	const [layout, setLayout] = useState('grid');

	const { data, error, isLoading } = useQuery({
		operationName: 'products/all',
		enabled: true,
	});

	if (error) {
		return <p>{error.message}</p>;
	}

	const getSeverity = (product: Product) => {
		switch (product.active) {
			case true:
				return 'success';

			case false:
				return 'danger';

			default:
				return null;
		}
	};

	const listItem = (product: Product) => {
		return (
			<div className="col-12">
				<div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
					<Image src={product.image} alt={product.name} width={205} height={201} className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" />
					<div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
						<div className="flex flex-column align-items-center sm:align-items-start gap-3">
							<div className="text-2xl font-bold text-900">{product.name}</div>
							<div className="text-900">{product.description}</div>
						</div>
						<div className="flex align-items-center gap-3">
							<Tag value={product.active ? ("Active") : ("Desactived")} severity={getSeverity(product)}></Tag>
						</div>
						<div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
							<span className="font-semibold">C: {product._count.courses}</span>
							<span className="font-semibold">P: {product._count.payments}</span>
							<Button onClick={() => router.push(`/products/${product.id}`)} icon="pi pi-arrow-right" className="p-button-rounded" ></Button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const gridItem = (product: Product) => {
		return (
			<div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
				<div className="p-4 border-1 surface-border surface-card border-round">
					<div className="flex flex-wrap align-items-center justify-content-between gap-2">
						<Tag value={product.active ? ("Active") : ("Desactived")} severity={getSeverity(product)}></Tag>
					</div>
					<div className="flex flex-column align-items-center gap-3 py-5">
						<Image className="w-9 shadow-2 border-round" src={product.image} alt={product.name} width={205} height={201} />
						<div className="text-2xl font-bold">{product.name}</div>
						<div className="text-900">{product.description}</div>
					</div>
					<div className="flex align-items-center justify-content-between">
						<span className="font-semibold">M: {product._count.courses}</span>
						<span className="font-semibold">L: {product._count.payments}</span>
						<Button onClick={() => router.push(`/products/${product.id}`)} icon="pi pi-arrow-right" className="p-button-rounded" ></Button>
					</div>
				</div>
			</div>
		);
	};

	const itemTemplate = (product: Product, layout: string) => {
		if (!product) {
			return;
		}

		if (layout === 'list') return listItem(product);
		else if (layout === 'grid') return gridItem(product);
	};

	const header = () => {
		return (
			<div className="flex justify-content-end">
				<DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
			</div>
		);
	};

	return (
		<>
			{!isLoading ? (
				<div className="card">
					<DataView value={data?.products} itemTemplate={itemTemplate} layout={layout} header={header()} />
				</div>
			) : (
				<Loading />
			)}
		</>
	);
};

export default ProductsList;