import SectionWrapper from "~/components/SectionWrapper";
import { type NextPage } from 'next/types';

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import Stats from "~/components/ui/home/Stats";
import ProductsList from "~/components/ui/products/ProductsList";

const Products: NextPage = () => {

	return (
		<><Header title="Products - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<Stats />
				<ProductsList />
			</SectionWrapper>
		</>
	);
};

export default Products;