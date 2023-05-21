import { Suspense } from "react";
import Nav from "~/app/components/layout/Nav";
import Footer from "~/app/components/layout/Footer";

type Props = {
	children: React.ReactNode;
};

const SectionWrapper = ({ children }: Props ) => (
	<div className="flex w-full flex-col px-6 py-16" >
			{children}
 	</div>
);

export default SectionWrapper;