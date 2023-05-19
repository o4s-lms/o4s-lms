import { useRef } from "react";
import { useRouter } from "next/router";
import { api, type RouterOutputs } from "~/utils/api";

import Header from "~/components/ui/Header";
import Nav from "~/components/ui/Nav";
import SectionWrapper from "~/components/SectionWrapper";
import Loading from "~/components/ui/Loading";
import { Toast } from "primereact/toast";
import CreateModuleForm from "~/components/forms/CreateModuleForm";
import ProductHeader from "~/components/ui/products/ProductHeader";
import CoursesList from "~/components/ui/products/CoursesList";

const ManageProduct = () => {
	const router = useRouter();
	const toast = useRef<Toast>(null);

	const query = router.query;
	const productId: string = query.productId;

	//if (typeof courseId !== "string") {
	//  throw new Error("missing id");
	//}

	const productQuery = api.product.byId.useQuery({ id: parseInt(productId) });

	const deleteProductMutation = api.product.delete.useMutation({
		onSettled: () => {
			void productQuery.refetch();
			void router.push('/products');
			toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully', life: 3000 });
		},
		onError: (error) => {
			console.error(error);
			toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
		},
	});

	return (
		<><Toast ref={toast} />
			{productQuery.data ? (
				<><Header title={productQuery.data.name} />
					<Nav />
					<ProductHeader
						id={productQuery.data.id}
						name={productQuery.data.name}
						image={productQuery.data.image}
						active={productQuery.data.active}
						onProductDelete={() => deleteProductMutation.mutate(productQuery.data.id)} />
					<SectionWrapper className="mt-0">
						{productQuery.data.courses.length === 0 ? (
							<CreateModuleForm courseId={productQuery.data.id} />
						) : (
							<CoursesList courses={productQuery.data.courses} />
						)}
					</SectionWrapper>
				</>
			) : (
				<Loading />
			)}
		</>
	);

};

export default ManageProduct;