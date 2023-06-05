import { useRef, useState } from "react";
import { useRouter } from "next/router";

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import SectionWrapper from "~/components/SectionWrapper";
import Loading from "~/components/ui/Loading";
import { Toast } from "primereact/toast";
import ProductHeader from "~/components/ui/products/ProductHeader";
import CoursesList from "~/components/ui/products/CoursesList";
import { useQuery } from "~/utils/wundergraph";

const ManageProduct = () => {
	const toast = useRef<Toast>(null);
	const { query: { productId } } = useRouter();

	//if (typeof courseId !== "string") {
	//  throw new Error("missing id");
	//}

	const { data, error, isLoading } = useQuery({
		operationName: 'products/id',
		input: {
			id: productId
		},
		enabled: true,
	});

	if (error) {
		return <p>{error.message}</p>;
	}

	return (
		<><Toast ref={toast} />
			{!isLoading ? (
				<><Header title={data?.product?.name} />
					<Nav />
					<ProductHeader
						id={data?.product?.id}
						name={data?.product?.name}
						image={data?.product?.image}
						active={data?.product?.active}
					/>
					<SectionWrapper className="mt-0">
						<CoursesList productId={data?.product?.id} courses={data?.product?.courses} />
					</SectionWrapper>
				</>
			) : (
				<Loading />
			)}
		</>
	);

};

export default ManageProduct;