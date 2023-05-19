import SectionWrapper from "~/components/SectionWrapper";
import { type GetServerSideProps, type NextPage } from 'next/types';
import { getServerSession } from "next-auth/next";
import type Session from "next-auth/next";
import { useSession } from "next-auth/react"

import Header from "~/components/ui/Header";
import Nav from "~/components/ui/Nav";
import CoursesList from "~/components/ui/CoursesList";
import Stats from "~/components/ui/Stats";
import { authOptions } from "@o4s/auth";

type Props = {
	session: Session;
	isAdmin: boolean;
};

const Home: NextPage<Props> = () => {

	return (
		<><Header title="Cursos - Admin" />
			<Nav />
			<SectionWrapper className="mt-0">
				<Stats />
				<CoursesList />
			</SectionWrapper>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context.req, context.res, authOptions)

	if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  };

	const isAdmin = session.user.roles.includes('admin');

	if (!isAdmin) {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  };

	return {
    props: {
			session,
      isAdmin,
    },
  };

};

export default Home;