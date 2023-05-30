import SectionWrapper from "~/components/SectionWrapper";
import { type NextPage } from 'next/types';

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import Stats from "~/components/ui/home/Stats";
import TagsTable from "~/components/ui/site/TagsTable";
import { useQuery } from "~/utils/wundergraph";
import Loading from "~/components/ui/Loading";

const Tags: NextPage = () => {
	const { data, error, isLoading } = useQuery({
		operationName: 'blog/tags',
		input: {
			language: 'pt',
		}
	})

	return (
		<><Header title="Blog - Tags - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<Stats />
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