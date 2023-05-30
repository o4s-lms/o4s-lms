import SectionWrapper from "~/components/SectionWrapper";
import { type NextPage } from 'next/types';

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import TagsTable from "~/components/ui/site/TagsTable";
import { useQuery } from "~/utils/wundergraph";
import Loading from "~/components/ui/Loading";
import TagsHeader from "~/components/ui/site/TagsHeader";

const Tags: NextPage = () => {
	const { data, error, isLoading } = useQuery({
		operationName: 'blog/tags',
		input: {
			language: 'pt',
		},
		enabled: true,
	})

	return (
		<><Header title="Blog - Tags - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<TagsHeader />
				{!isLoading ? (
					<TagsTable tags={data?.tags} />
				) : (
					<Loading />
				)}
			</SectionWrapper>
		</>
	);
};

export default Tags;