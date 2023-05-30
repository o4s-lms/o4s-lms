import SectionWrapper from "~/components/SectionWrapper";
import { type NextPage } from 'next/types';

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import PostsTable from "~/components/ui/site/PostsTable";
import { useQuery } from "~/utils/wundergraph";
import Loading from "~/components/ui/Loading";
import TagsHeader from "~/components/ui/site/TagsHeader";

const Posts: NextPage = () => {
	const { data, error, isLoading } = useQuery({
		operationName: 'blog/posts-all',
		enabled: true,
	})

	return (
		<><Header title="Blog - Posts - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<TagsHeader />
				{!isLoading ? (
					<PostsTable posts={data?.posts} />
				) : (
					<Loading />
				)}
			</SectionWrapper>
		</>
	);
};

export default Posts;