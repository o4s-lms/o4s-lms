/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useRef } from "react";
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
	const router = useRouter();
	const toast = useRef<Toast>(null);

	const query = router.query;
	const productId: string = query.productId;

	//if (typeof courseId !== "string") {
	//  throw new Error("missing id");
	//}

	const { data, error, isLoading } = useQuery({
		operationName: 'products/id',
		input: {
			id: parseInt(productId)
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
						<CoursesList courses={data?.product?.courses} />
					</SectionWrapper>
				</>
			) : (
				<Loading />
			)}
		</>
	);

};

export default ManageProduct;