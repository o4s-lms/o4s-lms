import SectionWrapper from "~/components/SectionWrapper";
import { type NextPage } from 'next/types';

import Header from "~/components/ui/layout/Header";
import Nav from "~/components/ui/layout/Nav";
import PostsTable from "~/components/ui/site/PostsTable";
import { useQuery } from "@o4s/generated-wundergraph/nextjs";
import Loading from "~/components/ui/Loading";
import PostsHeader from "~/components/ui/site/PostsHeader";

const Posts: NextPage = () => {
	const { data, error, isLoading } = useQuery({
		operationName: 'blog/posts-all',
		enabled: true,
	})

	return (
		<><Header title="Blog - Posts - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<PostsHeader />
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