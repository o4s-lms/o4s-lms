import SectionWrapper from "~/components/SectionWrapper";
import { type NextPage } from 'next/types';

import Header from "~/components/ui/Header";
import Nav from "~/components/ui/Nav";
import Stats from "~/components/ui/Stats";
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