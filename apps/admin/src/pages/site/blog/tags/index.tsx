import SectionWrapper from "~/components/SectionWrapper";
import { type NextPage } from 'next/types';

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import Stats from "~/components/ui/home/Stats";
import TagsTable from "~/components/ui/site/TagsTable";

const Tags: NextPage = () => {

	return (
		<><Header title="Blog - Tags - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<Stats />
				<TagsTable />
			</SectionWrapper>
		</>
	);
};

export default Tags;